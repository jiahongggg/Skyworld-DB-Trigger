import { dbMySQL } from '../app';

// Create a new lead master record
export const createLeadMaster = async (req, res, next) => {
    try {
        const {
            MasterUUID,
            MasterLeadID,
            ReasonDropped,
            MasterIsReassigned,
            Remark,
            CreatedBy,
            DateCreated,
            ModifiedBy,
            DateModified,
            Deleted
        } = req.body;

        const insertQuery = `
            INSERT INTO lead_master 
            (MasterUUID, MasterLeadID, ReasonDropped, MasterIsReassigned, Remark, CreatedBy, DateCreated, ModifiedBy, DateModified, Deleted) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            MasterUUID,
            MasterLeadID,
            ReasonDropped,
            MasterIsReassigned,
            Remark,
            CreatedBy,
            DateCreated,
            ModifiedBy,
            DateModified,
            Deleted
        ];

        await new Promise((resolve, reject) => {
            dbMySQL.query(insertQuery, values, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });

        return res.status(201).json({ message: 'Lead master created successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all lead master records
export const getLeadMaster = async (req, res, next) => {
    try {
        const query = "SELECT * FROM lead_master";
        const results = await new Promise((resolve, reject) => {
            dbMySQL.query(query, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            });
        });

        return res.status(200).json(results);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a lead master record
export const updateLeadMaster = async (req, res, next) => {
    try {
        const { MasterUUID } = req.params;
        const {
            MasterLeadID,
            ReasonDropped,
            MasterIsReassigned,
            Remark,
            ModifiedBy,
            DateModified,
            Deleted
        } = req.body;

        const updateQuery = `
            UPDATE lead_master 
            SET MasterLeadID = ?, ReasonDropped = ?, MasterIsReassigned = ?, Remark = ?, ModifiedBy = ?, DateModified = ?, Deleted = ?
            WHERE MasterUUID = ?
        `;

        const values = [
            MasterLeadID,
            ReasonDropped,
            MasterIsReassigned,
            Remark,
            ModifiedBy,
            DateModified,
            Deleted,
            MasterUUID
        ];

        await new Promise((resolve, reject) => {
            dbMySQL.query(updateQuery, values, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });

        return res.status(200).json({ message: 'Lead master updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a lead master record
export const deleteLeadMaster = async (req, res, next) => {
    try {
        const { MasterUUID } = req.params;

        const deleteQuery = `
            DELETE FROM lead_master
            WHERE MasterUUID = ?
        `;

        await new Promise((resolve, reject) => {
            dbMySQL.query(deleteQuery, [MasterUUID], (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });

        return res.status(200).json({ message: 'Lead master deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
