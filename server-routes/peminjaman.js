const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../server-config/db');

// Data dashboard Pegawai
router.get('/dashboard-pegawai', async(req, res) =>{
    try {
        const pool = await getPool();

        const query = ``;
    } catch (error) {
        
    }
})