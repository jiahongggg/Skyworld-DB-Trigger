import express from 'express';
import {
    getLeadMaster,
    createLeadMaster,
    updateLeadMaster,
    deleteLeadMaster
} from '../controllers/lead_master_controller';

const router = express.Router();

router.get('/', getLeadMaster);
router.post('/', createLeadMaster);
router.put('/:MasterUUID', updateLeadMaster);
router.delete('/:MasterUUID', deleteLeadMaster);

export default router;
