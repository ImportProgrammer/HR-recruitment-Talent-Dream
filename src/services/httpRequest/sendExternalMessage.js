import axios from "axios";
import config from "../../config/env.js";
import logger from "../../utils/logger.js";


//#region Envio mensajes WP
// * Configuración de envio de mensajes a SAI para la prueba
export const sendTechnicalTest = async (job_description, cantidad_preguntas, nivel_experiencia) => {
    try {
        const response = await axios({
        method: 'post',
        url: 'https://sai-library.saiapplications.com/api/templates/66fb0c935c4aa8191c2b7c51/execute',
        headers: {
            'X-Api-Key': `${config.API_SAI}`
        },
        data: {
            inputs: {
            "job_description": job_description,
            "cantidad_preguntas": cantidad_preguntas,
            "nivel_experiencia": nivel_experiencia,
            }
        }
        });
    
        // Retorna la respuesta de la API externa
        return response.data;
        
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        throw error;  
    }
    };

export default sendTechnicalTest

//#endregion

//#region 
export const sendFeedBackTest = async (test, respuestas_candidato, job_description, nivel_experiencia) => {
    try {
        const response = await axios({
        method: 'post',
        url: 'https://sai-library.saiapplications.com/api/templates/6717873df40f9ea287370e45/execute',
        headers: {
            'X-Api-Key': `${config.API_SAI}`
        },
        data: {
            inputs: {
            "test": test,
            "respuestas_candidato": respuestas_candidato,
            "job_description": job_description,
            "nivel_experiencia": nivel_experiencia,
            }
        }
        });
    
        // Retorna la respuesta de la API externa
        return response.data;
        
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        throw error;  // Lanza el error para que sea manejado por el try-catch del flujo
    }
};
//#endregion

//#region 
export const sendFeedBackTestComplete = async (test, respuestas_candidato, job_description, nivel_experiencia) => {
    try {
        const response = await axios({
        method: 'post',
        url: 'https://sai-library.saiapplications.com/api/templates/67c62ebfc429b95967845d44/execute',
        headers: {
            'X-Api-Key': `${config.API_SAI}`
        },
        data: {
            inputs: {
            "test": test,
            "respuestas_candidato": respuestas_candidato,
            "job_description": job_description,
            "nivel_experiencia": nivel_experiencia,
            }
        }
        });
    
        // Retorna la respuesta de la API externa
        return response.data;
        
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        throw error;  // Lanza el error para que sea manejado por el try-catch del flujo
    }
};
//#endregion

//#region 

export const sendEmailVerify = async(nombre_candidato, vacante, prueba_tecnica, feedback, feedback_completo, state, email) => {
    
    const api_url = 'https://prod-31.westus.logic.azure.com:443/workflows/552c15c55d78433da5d98ee8cff10f3d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MQBJcpUoCtSthL11Z4WS_lVfi_0TNK39Ls1G9wAnrkQ'

    try {
        logger.info('Enviando información al analista');
        const response = await axios.post(api_url, {
            "nombre_candidato": nombre_candidato,
            "vacante": vacante,
            "prueba_tecnica": prueba_tecnica,
            "feedback": feedback, 
            "feedback_completo": feedback_completo,
            "state": state, 
            "email_analista": email
        });
        logger.info('Mensaje enviado');
        return "Mensaje enviado";
    } catch (error) {
        logger.error('Error al llamar el servicio de verificación:', error.message);
        if (error.response) {
            logger.error('Detalles del error en la respuesta:', error.response.data);
        }
        throw error;  // Lanza el error para que pueda ser manejado en `Process`
    }
}

//#endregion