import axios from 'axios'
import { Router } from 'express'

import { axiosRequestConfig } from '../configs/request.config'
import { CONSTANTS } from '../utils/env'
import { logError, logInfo } from '../utils/logger'
import { ERROR } from '../utils/message'

const API_END_POINTS = {
    addDataNode: `${CONSTANTS.FRAC_API_BASE}/fracapis/frac/addDataNode`,
    addDataNodeBulk: `${CONSTANTS.FRAC_API_BASE}/fracapis/frac/addDataNodeBulk`,
    getActivity: `${CONSTANTS.FRAC_API_BASE}/fracapis/frac/getAllNodes?type=ACTIVITY&status=VERIFIED`,
    getCompetencyArea: `${CONSTANTS.FRAC_API_BASE}/fracapis/frac/getAllNodes?type=COMPETENCYAREA`,
    getDictionary: `${CONSTANTS.FRAC_API_BASE}/fracapis/frac/getAllNodes?type=COMPETENCY&status=VERIFIED`,
    getNodeById: (id: string, type: string) =>
        `${CONSTANTS.FRAC_API_BASE}/fracapis/frac/getNodeById?id=${id}&type=${type}&isDetail=true`,
    getRole: `${CONSTANTS.FRAC_API_BASE}/fracapis/frac/getAllNodes?type=ROLE&status=VERIFIED`,
    searchNodes: `${CONSTANTS.FRAC_API_BASE}/fracapis/frac/searchNodes`,
}

export const fracApi = Router()
const unknownError = 'Failed due to unknown reason'

fracApi.get('/getAllNodes/:type', async (req, res) => {
    try {
        const type = req.params.type
        let apiEndPoint = ''
        switch (type) {
            case 'dictionary':
                apiEndPoint = API_END_POINTS.getDictionary
                break
            case 'competencyarea':
                apiEndPoint = API_END_POINTS.getCompetencyArea
                break
            case 'role':
                apiEndPoint = API_END_POINTS.getRole
                break
            case 'activity':
                apiEndPoint = API_END_POINTS.getActivity
                break
            default:
                res.status(400).send('TYPE_IS_NOT_PROVIDED_OR_TYPE_IS_NOT_CONFIGURED')
                break
        }
        const response = await axios.get(apiEndPoint, {
            ...axiosRequestConfig,
            headers: {
                Authorization: req.header('Authorization'),
            },
        })
        res.status(response.status).send(response.data)
    } catch (err) {
        res.status((err && err.response && err.response.status) || 500).send(
            (err && err.response && err.response.data) || {
                error: unknownError,
            }
        )
    }
})

fracApi.post('/addDataNode', async (req, res) => {
    try {
        const response = await axios.post(API_END_POINTS.addDataNode, req.body, {
            ...axiosRequestConfig,
            headers: {
                Authorization: req.header('Authorization'),
            },
        })
        res.status(response.status).send(response.data)
    } catch (err) {
        res.status((err && err.response && err.response.status) || 500).send(
            (err && err.response && err.response.data) || {
                error: unknownError,
            }
        )
    }
})

fracApi.post('/addDataNodeBulk', async (req, res) => {
    try {
        const response = await axios.post(API_END_POINTS.addDataNodeBulk, req.body, {
            ...axiosRequestConfig,
            headers: {
                Authorization: req.header('Authorization'),
            },
        })
        res.status(response.status).send(response.data)
    } catch (err) {
        res.status((err && err.response && err.response.status) || 500).send(
            (err && err.response && err.response.data) || {
                error: unknownError,
            }
        )
    }
})

fracApi.post('/searchNodes', async (req, res) => {
    try {
        const response = await axios.post(API_END_POINTS.searchNodes, req.body, {
            ...axiosRequestConfig,
            headers: {
                Authorization: req.header('Authorization'),
            },
        })
        res.status(response.status).send(response.data)
    } catch (err) {
        res.status((err && err.response && err.response.status) || 500).send(
            (err && err.response && err.response.data) || {
                error: unknownError,
            }
        )
    }
})

fracApi.get('/getNodeById/:id/:type', async (req, res) => {
    try {
        const id = req.params.id
        const type = req.params.type
        const response = await axios.get(API_END_POINTS.getNodeById(id, type), {
            ...axiosRequestConfig,
            headers: {
                Authorization: req.header('Authorization'),
            },
        })
        res.status(response.status).send(response.data)
    } catch (err) {
        res.status((err && err.response && err.response.status) || 500).send(
            (err && err.response && err.response.data) || {
                error: unknownError,
            }
        )
    }
})

fracApi.get('/:type/:key', async (req, res) => {
    try {
        const rootOrg = req.header('rootOrg')
        const authToken = req.header('Authorization')
        if (!rootOrg || !authToken) {
            res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
            return
        }
        const key = req.params.key as string
        const type = req.params.type as string
        const searchBody = {
            childCount : true,
            childNodes: true,
            searches: [
              {
                field : 'name',
                keyword : key,
                type,
                },
                  {
                    field : 'status',
                    keyword : 'VERIFIED',
                    type,
                      },
                ],
          }
        logInfo('Req body========>', JSON.stringify(searchBody))
        const response = await axios.post(API_END_POINTS.searchNodes, searchBody, {
            ...axiosRequestConfig,
            headers: {
                Authorization: req.header('Authorization'),
            },
        })
        res.status(200).send(response.data)
    } catch (err) {
        logError('ERROR --> ', err)
        res.status((err && err.response && err.response.status) || 500).send(
            (err && err.response && err.response.data) || {
                error: ERROR.GENERAL_ERR_MSG,
            }
        )
    }
})
