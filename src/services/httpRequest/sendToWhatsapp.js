import axios from "axios";
import config from "../../config/env.js";
import logger from "../../utils/logger.js";


//#region Envio mensajes WP
// * Configuración de envio de mensajes a whatsapp
const sendToWhatsApp = async (data) => {
    const baseUrl =`${config.BASE_URL}/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`;
    const headers = { 
        Authorization: `Bearer ${config.API_TOKEN}`
    };
    
    try {
        const response = await axios ({
            method: 'POST', 
            url: baseUrl, 
            headers: headers, 
            data,
        })
        return response.data;
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        console.error(error);
    }
}

export default sendToWhatsApp;

//#endregion


