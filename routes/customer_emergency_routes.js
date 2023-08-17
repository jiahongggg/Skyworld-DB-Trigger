import express from 'express';
import {
    getCustomerEmergency,
    createCustomerEmergency,
    updateCustomerEmergency,
    deleteCustomerEmergency
} from '../controllers/customer_emergency_controller';

const router = express.Router();

router.get('/', getCustomerEmergency);
router.post('/', createCustomerEmergency);
router.put('/:EmergencyID', updateCustomerEmergency);
router.delete('/:EmergencyID', deleteCustomerEmergency);

export default router;
