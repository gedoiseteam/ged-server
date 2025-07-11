const { e } = require('@utils/logs');
const AnnouncementsRepository = require('@repositories/announcementsRepository');
const Announcement = require("@models/announcement");
const formatOracleError = require("@utils/exceptionUtils")

const announcementsRepository = new AnnouncementsRepository();

const getAnnouncements = async (req, res) => {
    try {
        const result = await announcementsRepository.getAllAnnouncements();
        res.json(result);
    }
    catch (error) {
        const serverResponse = {
            message: 'Error to get all announcements',
            error : error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

const createAnnouncement = async (req, res) => {
    const {
        ANNOUNCEMENT_ID: id,
        ANNOUNCEMENT_TITLE: title,
        ANNOUNCEMENT_CONTENT: content,
        ANNOUNCEMENT_DATE: date,
        USER_ID: userId
    } = req.body;

    if(!content || !date || !userId) {
        const serverResponse = {
            message: "Error to create announcement",
            error: `
            Some missing announcement fields : 
            {
                content: ${content},
                date: ${date},
                userId: ${userId}
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const announcement = new Announcement(id, title, content, date, userId);
        await announcementsRepository.createAnnouncement(announcement);

        const serverResponse = {
            message: `Announcement created successfully`
        };

        res.status(201).json(serverResponse);
    }
    catch (error) {
        const serverResponse = formatOracleError(error, 'Error creating announcement');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse)
    }
}

const updateAnnouncement = async (req, res) => {
    const {
        ANNOUNCEMENT_ID: id,
        ANNOUNCEMENT_TITLE: title,
        ANNOUNCEMENT_CONTENT: content,
        ANNOUNCEMENT_DATE: date,
        USER_ID: userId
    } = req.body;

    if(!content || !date || !userId) {
        const serverResponse = {
            message: "Error to update announcement",
            error: `
            Some missing announcement fields : 
            {
                content: ${content},
                date: ${date},
                userId: ${userId}
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const announcement = new Announcement(id, title, content, date, userId);
        await announcementsRepository.updateAnnouncement(announcement);

        const serverResponse = {
            message: `Announcement ${announcement.id} updated successfully`
        };

        res.status(201).json(serverResponse);
    }
    catch (error) {
        const serverResponse = formatOracleError(error, 'Error updating announcement');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse)
    }
}

const deleteAnnouncement = async (req, res) => {
    const announcementId = req.params.id;

    try {
        await announcementsRepository.deleteAnnouncement(announcementId);
        const serverResponse = {
            message: `Announcement ${announcementId} deleted successfully`
        };

        res.status(200).json(serverResponse);
    }
    catch (error) {
        const serverResponse = formatOracleError(error, 'Error delete announcement');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

module.exports = {
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
}