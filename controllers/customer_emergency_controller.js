import { dbMySQL } from '../app';

export const createCustomerEmergency = async (req, res, next) => {
    try {
        const {
            EmergencyName,
            EmergencyContactNo,
            EmergencyEmail,
            Remark
        } = req.body;

        // Check if either EmergencyEmail or EmergencyContactNo is provided
        if (!EmergencyEmail && !EmergencyContactNo) {
            return res.status(400).json({ message: 'Either EmergencyEmail or EmergencyContactNo must be provided' });
        }

        const CreatedBy = 'Developer'; // Set default CreatedBy
        const DateCreated = new Date(); // Set current date and time
        const Deleted = 0; // Default Deleted value

        if (EmergencyContactNo) {
            // Check if the contact exists in global_contact
            const contactCheckQuery = `
                SELECT Contact FROM global_contact WHERE Contact = ?
            `;
            const contactCheckValues = [EmergencyContactNo];

            const contactCheckResult = await new Promise((resolve, reject) => {
                dbMySQL.query(contactCheckQuery, contactCheckValues, (contactCheckErr, contactCheckResult) => {
                    if (contactCheckErr) {
                        reject(contactCheckErr);
                    }
                    resolve(contactCheckResult);
                });
            });

            if (contactCheckResult.length === 0) {
                // Contact doesn't exist, insert it into global_contact
                const contactInsertQuery = `
                    INSERT INTO global_contact (Contact, Remark, CreatedBy, DateCreated, Deleted)
                    VALUES (?, ?, ?, ?, ?)
                `;
                const contactInsertValues = [EmergencyContactNo, Remark, CreatedBy, DateCreated, Deleted];

                await new Promise((resolve, reject) => {
                    dbMySQL.query(contactInsertQuery, contactInsertValues, (contactInsertErr, contactInsertResult) => {
                        if (contactInsertErr) {
                            reject(contactInsertErr);
                        }
                        resolve(contactInsertResult);
                    });
                });
            }
        }

        if (EmergencyEmail) {
            // Check if the email exists in global_email
            const emailCheckQuery = `
                SELECT Email FROM global_email WHERE Email = ?
            `;
            const emailCheckValues = [EmergencyEmail];

            const emailCheckResult = await new Promise((resolve, reject) => {
                dbMySQL.query(emailCheckQuery, emailCheckValues, (emailCheckErr, emailCheckResult) => {
                    if (emailCheckErr) {
                        reject(emailCheckErr);
                    }
                    resolve(emailCheckResult);
                });
            });

            if (emailCheckResult.length === 0) {
                // Email doesn't exist, insert it into global_email
                const emailInsertQuery = `
                    INSERT INTO global_email (Email, Remark, CreatedBy, DateCreated, Deleted)
                    VALUES (?, ?, ?, ?, ?)
                `;
                const emailInsertValues = [EmergencyEmail, Remark, CreatedBy, DateCreated, Deleted];

                await new Promise((resolve, reject) => {
                    dbMySQL.query(emailInsertQuery, emailInsertValues, (emailInsertErr, emailInsertResult) => {
                        if (emailInsertErr) {
                            reject(emailInsertErr);
                        }
                        resolve(emailInsertResult);
                    });
                });
            }
        }

        const insertQuery = `
            INSERT INTO customer_emergency
            (EmergencyName, EmergencyContactNo, EmergencyEmail, Remark, CreatedBy, DateCreated, Deleted)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            EmergencyName,
            EmergencyContactNo,
            EmergencyEmail,
            Remark,
            CreatedBy,
            DateCreated,
            Deleted
        ];

        await new Promise((resolve, reject) => {
            dbMySQL.query(insertQuery, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        return res.status(201).json({ message: 'Customer emergency created successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const getCustomerEmergency = async (req, res, next) => {
    try {
        const query = `
            SELECT ce.*, gc.Contact AS EmergencyContactNo, ge.Email AS EmergencyEmail
            FROM customer_emergency ce
            LEFT JOIN global_contact gc ON ce.EmergencyContactNo = gc.Contact
            LEFT JOIN global_email ge ON ce.EmergencyEmail = ge.Email
        `;

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


export const updateCustomerEmergency = async (req, res, next) => {
    try {
        const { EmergencyID } = req.params;
        const {
            EmergencyName,
            EmergencyContactNo,
            EmergencyEmail,
            Remark,
            ModifiedBy,
            DateModified
        } = req.body;

        const updateQuery = `
            UPDATE customer_emergency
            SET EmergencyName = ?, Remark = ?, ModifiedBy = ?, DateModified = ?
            WHERE EmergencyID = ?
        `;

        const values = [
            EmergencyName,
            Remark,
            ModifiedBy,
            DateModified,
            EmergencyID
        ];

        await new Promise((resolve, reject) => {
            dbMySQL.query(updateQuery, values, async (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (EmergencyContactNo) {
                        const contactCheckQuery = `
                            SELECT Contact FROM global_contact WHERE Contact = ?
                        `;
                        const contactCheckValues = [EmergencyContactNo];

                        const contactCheckResult = await new Promise((resolve, reject) => {
                            dbMySQL.query(contactCheckQuery, contactCheckValues, (contactCheckErr, contactCheckResult) => {
                                if (contactCheckErr) {
                                    reject(contactCheckErr);
                                }
                                resolve(contactCheckResult);
                            });
                        });

                        if (contactCheckResult.length === 0) {
                            const contactInsertQuery = `
                                INSERT INTO global_contact (Contact, Remark, CreatedBy, DateCreated, Deleted)
                                VALUES (?, ?, ?, ?, ?)
                            `;
                            const contactInsertValues = [EmergencyContactNo, Remark, ModifiedBy, DateModified, 0];

                            await new Promise((resolve, reject) => {
                                dbMySQL.query(contactInsertQuery, contactInsertValues, (contactInsertErr, contactInsertResult) => {
                                    if (contactInsertErr) {
                                        reject(contactInsertErr);
                                    }
                                    resolve(contactInsertResult);
                                });
                            });
                        }
                    }

                    if (EmergencyEmail) {
                        const emailUpdateQuery = `
                            UPDATE global_email
                            SET Remark = ?, ModifiedBy = ?, DateModified = ?
                            WHERE Email = ?
                        `;
                        const emailUpdateValues = [Remark, ModifiedBy, DateModified, EmergencyEmail];
                        await new Promise((resolveEmail, rejectEmail) => {
                            dbMySQL.query(emailUpdateQuery, emailUpdateValues, (emailErr, emailResult) => {
                                if (emailErr) {
                                    rejectEmail(emailErr);
                                }
                                resolveEmail(emailResult);
                            });
                        });
                    }

                    resolve(result);
                }
            });
        });

        return res.status(200).json({ message: 'Customer emergency updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const deleteCustomerEmergency = async (req, res, next) => {
    try {
        const { EmergencyID } = req.params;

        const deleteQuery = `
            DELETE FROM customer_emergency
            WHERE EmergencyID = ?
        `;

        await new Promise((resolve, reject) => {
            dbMySQL.query(deleteQuery, [EmergencyID], async (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    const selectQuery = `
                        SELECT EmergencyContactNo, EmergencyEmail
                        FROM customer_emergency
                        WHERE EmergencyID = ?
                    `;

                    const selectValues = [EmergencyID];

                    const selectResults = await new Promise((resolveSelect, rejectSelect) => {
                        dbMySQL.query(selectQuery, selectValues, (selectErr, selectResult) => {
                            if (selectErr) {
                                rejectSelect(selectErr);
                            }
                            resolveSelect(selectResult);
                        });
                    });

                    if (selectResults.length > 0) {
                        const { EmergencyContactNo, EmergencyEmail } = selectResults[0];

                        if (EmergencyContactNo) {
                            const deleteContactQuery = `
                                DELETE FROM global_contact
                                WHERE Contact = ?
                            `;

                            await new Promise((resolve, reject) => {
                                dbMySQL.query(deleteContactQuery, [EmergencyContactNo], (contactErr, contactResult) => {
                                    if (contactErr) {
                                        reject(contactErr);
                                    }
                                    resolve(contactResult);
                                });
                            });
                        }

                        if (EmergencyEmail) {
                            const deleteEmailQuery = `
                                DELETE FROM global_email
                                WHERE Email = ?
                            `;

                            await new Promise((resolve, reject) => {
                                dbMySQL.query(deleteEmailQuery, [EmergencyEmail], (emailErr, emailResult) => {
                                    if (emailErr) {
                                        reject(emailErr);
                                    }
                                    resolve(emailResult);
                                });
                            });
                        }
                    }

                    resolve(result);
                }
            });
        });

        return res.status(200).json({ message: 'Customer emergency deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
