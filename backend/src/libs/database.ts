import { Collection, Db, MongoClient } from 'mongodb'
import DBError from '../errors/DBError'
import { BaseEntity } from '../types/common'

let db: Db

export enum DBCollection {
  PRODUCT_GROUP = 'ProductGroup',
  PRODUCT = 'Product',
  PARTNER = 'Partner',
  PARTNER_BRANCH = 'PartnerBranch',
  APPOINTMENT = 'Appointment',
  CUSTOMER = 'Customer',
  SURVEY_DEFINITION = 'SurveyDefinition',
  SURVEY_QUESTION_GROUP = 'SurveyQuestionGroup',
  SURVEY_QUESTION_CATEGORY = 'SurveyQuestionCategory',
  SURVEY_QUESTION = 'SurveyQuestion',
  CUSTOMER_SURVEY = 'CustomerSurvey',
  ORDER = 'Order',
  SMS_MESSAGE = 'SMSMessage',
  RUNTIME_SETTING = 'RuntimeSetting',
  RESULT_CATEGORY = 'ResultCategory',
  HEALTH_MEASURE = 'HealthMeasure',
  BLOOD_MEASURE = 'BloodMeasure',
  TEST_RESULT = 'TestResult',
  USER = 'User',
}

export const initDatabase = async (
  config: { uri: string; name: string },
  callBack?: () => void
): Promise<void> => {
  const { uri, name } = config

  try {
    const client = new MongoClient(uri, { useUnifiedTopology: true })
    await client.connect()
    db = client.db(name)

    if (callBack) callBack()
  } catch (err) {
    throw new DBError(err.code, err.message)
  }
}

export const getCollection = (colName: DBCollection): Collection => {
  if (!db) throw new Error('Database is not ready!')

  return db.collection(colName)
}

export const aggregate = async <T>(
  colName: DBCollection,
  pipeline: Record<string, unknown>[],
  options?: Record<string, unknown>
): Promise<T[]> => {
  try {
    const collection = getCollection(colName)

    const result: T[] = await collection.aggregate(pipeline, options).toArray()

    return result
  } catch (err) {
    throw new DBError(err.code, err.message)
  }
}

export const find = async <T>(
  colName: DBCollection,
  query: Record<string, unknown> = {},
  options?: Record<string, unknown>
): Promise<T[]> => {
  try {
    const collection = getCollection(colName)

    const result: T[] = await collection.find(query, options).toArray()

    return result
  } catch (err) {
    throw new DBError(err.code, err.message)
  }
}

export const findOne = async <T>(
  colName: DBCollection,
  query: Record<string, unknown>
): Promise<T> => {
  try {
    const collection = getCollection(colName)

    const result: T = await collection.findOne(query)

    return result
  } catch (err) {
    throw new DBError(err.code, err.message)
  }
}

export const insertOne = async <T>(
  colName: DBCollection,
  data: T & BaseEntity
): Promise<T | null> => {
  try {
    const collection = getCollection(colName)

    const result = await collection.insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Return the newly added data with _id
    const record: T = result.insertedCount === 1 ? result.ops[0] : null

    return record
  } catch (err) {
    throw new DBError(err.code, err.message)
  }
}

export const updateOne = async <T, D>(
  colName: DBCollection,
  query: Record<string, unknown>,
  data: D & BaseEntity
): Promise<T> => {
  try {
    const collection = getCollection(colName)

    const result = await collection.findOneAndUpdate(
      query,
      { $set: { ...data, updatedAt: new Date() } },
      { returnOriginal: false }
    )

    const record: T = result.value

    return record
  } catch (err) {
    throw new DBError(err.code, err.message)
  }
}

export const updateMany = async <T>(
  colName: DBCollection,
  query: Record<string, unknown>,
  data: T & BaseEntity
): Promise<number> => {
  try {
    const collection = getCollection(colName)

    const result = await collection.updateMany(query, { $set: { ...data, updatedAt: new Date() } })

    return result.modifiedCount
  } catch (err) {
    throw new DBError(err.code, err.message)
  }
}

export const upsertOne = async <T, D>(
  colName: DBCollection,
  query: Record<string, unknown>,
  data: D & BaseEntity,
  dataOnInsert?: D & BaseEntity
): Promise<T> => {
  try {
    const collection = getCollection(colName)
    const setOnInsert = dataOnInsert || {}

    const result = await collection.findOneAndUpdate(
      query,
      {
        $set: { ...data, updatedAt: new Date() },
        $setOnInsert: { ...setOnInsert, createdAt: new Date() },
      },
      { upsert: true, returnOriginal: false }
    )

    const record: T = result.value

    return record
  } catch (err) {
    throw new DBError(err.code, err.message)
  }
}

export const deleteOne = async (
  colName: DBCollection,
  query: Record<string, unknown>
): Promise<boolean> => {
  try {
    const collection = getCollection(colName)

    const result = await collection.deleteOne(query)

    return result.result?.ok > 0
  } catch (err) {
    throw new DBError(err.code, err.message)
  }
}

export const getNextSequenceNumber = async (
  colName: DBCollection,
  fieldName: string,
  step?: number
): Promise<number> => {
  try {
    const collection = getCollection(colName)

    const result = await collection
      .find()
      .sort({ [fieldName]: -1 })
      .limit(1)

    const records = await result.toArray()

    if (records.length === 0) return step || 1

    return Number(records[0][fieldName] || 0) + (step || 1)
  } catch (err) {
    throw new DBError(err.code, err.message)
  }
}
