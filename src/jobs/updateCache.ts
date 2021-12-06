import ß from 'bhala'

import { CACHE_KEY } from '../constants'
import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import data from '../services/data'

async function updateInstitutions(): Promise<void> {
  try {
    if (!(await cache.shouldUpdate(CACHE_KEY.INSTITUTIONS))) {
      return
    }

    ß.info(`[jobs/updateCache.js] Caching institutions…`)
    const institutions = await data.getInstitutions()
    await cache.set(CACHE_KEY.INSTITUTIONS, institutions)
  } catch (err) {
    handleError(err, 'jobs/updateCache#updateInstitutions()')
  }
}

async function updateServices(): Promise<void> {
  try {
    if (!(await cache.shouldUpdate(CACHE_KEY.SERVICES))) {
      return
    }

    ß.info(`[jobs/updateCache.js] Caching services…`)
    const services = await data.getServices()
    await cache.set(CACHE_KEY.SERVICES, services)
  } catch (err) {
    handleError(err, 'jobs/updateCache#updateServices()')
  }
}

async function updateJobs(): Promise<void> {
  try {
    if (!(await cache.shouldUpdate(CACHE_KEY.JOBS))) {
      return
    }

    ß.info(`[jobs/updateCache.js] Caching jobs…`)
    const jobs = await data.getJobs()
    await cache.set(CACHE_KEY.JOBS, jobs)
  } catch (err) {
    handleError(err, 'jobs/updateCache#updateJobs()')
  }
}

export default async function updateCache(): Promise<void> {
  try {
    await updateInstitutions()
    await updateServices()
    await updateJobs()
  } catch (err) {
    handleError(err, 'jobs/updateCache()')
  }
}
