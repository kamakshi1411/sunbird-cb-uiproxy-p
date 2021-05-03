import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../configs/request.config'
import { CONSTANTS } from '../utils/env'
import { logError } from '../utils/logger'
import { ERROR } from '../utils/message'
const API_END_POINTS = {
    getWAPdf: (userId: string, waId: string) => `${CONSTANTS.SB_EXT_API_BASE_2}/v1/workallocation/getWAPdf/${userId}/${waId}`,
}

export const workallocationPublic = Router()

workallocationPublic.get('/getWaPdf/:userId/:waId', async (req, res) => {
    try {
        const userId = req.params.userId
        const waId = req.params.waId
        const response = await axios.get(API_END_POINTS.getWAPdf(userId, waId), {
            ...axiosRequestConfig,
            headers: {
            },
        })
        res.status(response.status).send(response.data)
    } catch (err) {
        logError(err)
        res.status((err && err.response && err.response.status) || 500).send(
            (err && err.response && err.response.data) || {
                error: ERROR.GENERAL_ERR_MSG,
            }
        )
    }
})
