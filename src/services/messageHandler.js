import whatsappService from './whatsappService.js';
import { sendTechnicalTest, sendFeedBackTest, sendFeedBackTestComplete, sendEmailVerify } from '../services/httpRequest/sendExternalMessage.js';
import logger from '../utils/logger.js';

// TODO: Función para formatear el texto en HTML
function  fomrtearTextoParaHTML(text) {
  return text.replace(/\n/g, '<br>');    
}

// TODO: Clase para manejar las variables del flujo de la conversación:
class ConversationData{

  constructor(){
      this.nombre = "Manuel Gomez";
      this.vacante = "Programador fullstack";
      this.descripcion = "Buscamos un programador Fullstack con experiencia en desarrollo web utilizando tecnologías como Node.js, React y bases de datos SQL/NoSQL.";
      this.ubicacion = "Remoto";
      this.beneficios = "Ofrecemos un ambiente dinámico y flexible, con oportunidades de crecimiento profesional, plan de salud y capacitaciones continuas.";
      this.tuNombre = "Juan Gomez";
      this.posicion = "Gerente de Recursos Humanos";
      this.empresa = "Stefanini Group";
      this.levelExperience = "Senior";
      this.email_analista = "jmcardenas1@stefanini.com";
      this.tecnicalTestResponse = "";
      this.tecnicalTestProof = "";
      this.feedbackTestResponse = "";
      this.feedbackTestResponsePartial = "";
      this.stateFeedbackTestResponse = "";
  }

  // *Metodo para actualizar las variables
  setDatosCandidato (nombre, vacante, descripcion, ubicacion, beneficios, tuNombre, posicion, empresa, levelExperience){
      this.nombre = nombre;
      this.vacante = vacante;
      this.descripcion = descripcion;
      this.ubicacion = ubicacion;
      this.beneficios = beneficios;
      this.tuNombre = tuNombre;
      this.posicion = posicion;
      this.empresa = empresa;
      this.levelExperience = levelExperience;
  }

}


/** Aqui van las funciones de los mensajes */
// Función para generar el mensaje de invitación a participar en la vacante
function generarMensajeInvitacion(nombre, vacante, descripcion, ubicacion, beneficios, tuNombre, posicion, empresa) {
  return `¡Hola ${nombre}! 👋

  Esperamos que estés bien. 😊 En ${empresa}, estamos en la búsqueda de talento y creemos que podrías ser un excelente candidato para una vacante abierta que tenemos disponible.

  *Vacante*: ${vacante}  
  *Descripción*: ${descripcion}  
  *Modalidad de Trabajo*: ${ubicacion}  
  *Beneficios*: ${beneficios}

  ¡Nos encantaría contar contigo en nuestro equipo! 💼

  Saludos,  
  ${tuNombre}  
  ${posicion} - ${empresa}`;
}

//-------------------------------------------------------------------------------------------------

//#region FLujo de la conversación
class MessageHandler {

  constructor() {
    this.conversationData = new ConversationData(); 
    this.userState = {};
  }

  async handleIncomingMessage(message) {
    logger.info(JSON.stringify(message?.text?.body));
    logger.info(JSON.stringify(message?.interactive?.button_reply?.id));
        
    const senderId = message.from;
    const incomingMessage = message.text?.body?.toLowerCase().trim();
    
    if (incomingMessage === 'start') {
      if (this.isGreeting(incomingMessage)){
        await this.sendWelcomeMessage(senderId);
        await this.sendWelcomeMenu(senderId);
      } 
      await whatsappService.markAsRead(message.id);

    } 
    else if (message?.type === 'interactive' && message?.interactive?.button_reply?.id === 'option_1') {
      await this.sendInstructionMessage(senderId);
      await this.sendProofMessage(senderId);
      await whatsappService.markAsRead(message.id);
    } 
    else if (message?.type === 'interactive' && message?.interactive?.button_reply?.id === 'option_2') {
      await this.sendRejectionMessage(senderId);
      await whatsappService.markAsRead(message.id);
    }
    else if (message?.type === 'interactive' && message?.interactive?.button_reply?.id === 'option_3') {
      await this.sendDataUpdate(senderId);
      await whatsappService.markAsRead(message.id);
    }
    else if (message?.type === 'interactive' && message?.interactive?.button_reply?.id === 'option_4') {
      await this.sendNegativeMessage(senderId);
      await whatsappService.markAsRead(message.id);
    }
    else if (message?.type === 'interactive' && message?.interactive?.button_reply?.id === 'option_Empezar') {
      await this.sendTest(senderId);  
      await whatsappService.markAsRead(message.id);
    }
    else if (incomingMessage?.includes('respues')) {
      this.conversationData.tecnicalTestResponse = incomingMessage; 
      //await whatsappService.sendMessage(senderId, "Hemos recibido tus respuestas correctamente");
      await this.sendFeedback(senderId);  
      await whatsappService.markAsRead(message.id);
    }
  
  };
//#endregion

//#region Control de mensajes iniciales
  isGreeting(message) {
    const greetings = ["start"];
    return greetings.includes(message);
  };

  async sendWelcomeMessage(to, messageId) {
    const mensajeInvitacion = generarMensajeInvitacion(this.conversationData.nombre, this.conversationData.vacante, this.conversationData.descripcion, this.conversationData.ubicacion, this.conversationData.beneficios, this.conversationData.tuNombre, this.conversationData.posicion, this.conversationData.empresa);
    await whatsappService.sendMessage(to, mensajeInvitacion, messageId);
  };
//#endregion
  
//#region Mensaje dinámico para preguntar si quiere participar de la prueba
  async sendWelcomeMenu(to) {
    const titleBodyText = "¿Te gustaría participar en la vancate?"
    const menuMessage = "Selecciona una opción"
    const buttons = [
      {
        type: 'reply',
        reply: { 
          id: 'option_1', 
          title: 'Si' 
        }
      },
      {
        type: 'reply', 
        reply: 
        { 
          id: 'option_2', 
          title: 'No'
        }
      }
    ];

    await whatsappService.sendInteractiveButtons(to, titleBodyText, menuMessage, buttons);
  }

  waiting = (delay, callback) => {
    setTimeout(callback, delay);
  };
//#endregion

//#region Mesaje de instrucciones
  async sendInstructionMessage(to,messageId){
    const InstructionMessage = `*${this.conversationData.nombre}*, a continuación te presentaremos una validación técnica de 6 preguntas para evaluar tus habilidades. Esta prueba es parte del proceso de selección.\n\nAntes de presionar *Empezar*, por favor, lee atentamente las siguientes instrucciones:

 📌 *Instrucciones:*  
1️⃣ Envía todas tus respuestas en un solo mensaje, iniciando con la palabra _*Respuestas*_.  
   _*Ejemplo:* Respuesta 1: A, Respuesta 2: B, Respuesta 3: C..._\n  
2️⃣ Asegúrate de leer bien cada pregunta antes de responder.\n
3️⃣ Tienes un plazo de *3 días* para iniciar la prueba. Una vez que comiences, dispondrás de *30 minutos* para completarla.\n
4️⃣ Al hacer clic en *Empezar*, confirmas que has leído y aceptas nuestra [Link Política de Tratamiento de Datos].\n\nSiguiendo las anteriores indicaciones, garantizarás un proceso fluido y sin inconvenientes.`
    
    await whatsappService.sendMessage(to, InstructionMessage, messageId);
  };
//#endregion

//#region Mensaje para cuando el usuario no esta interesado en trabajar con Stefanini
  async sendNegativeMessage (to, messageId){
    const negativeMessage = `¿${this.conversationData.nombre} gracias por tu tiempo! 😊\nRespetamos tu decisión y no te enviaremos más información sobre futuras oportunidades.\nSi en algún momento cambias de opinión, estaremos encantados de volver a estar en contacto.\n\n*¡Te deseamos mucho éxito en tu camino profesional!* 🚀`
    await whatsappService.sendMessage(to, negativeMessage, messageId);
  };
//#endregion

//#region Boton de EMPEZAR prueba
  async sendProofMessage(to) {
    const titleBodyText = `Si ya quieres iniciar, da clic en EMPEZAR`
    const menuMessage = `\n¡Mucho éxito! 🚀`

    const buttons = [
      {
        type: 'reply',
        reply: { 
          id: 'option_Empezar', 
          title: 'Empezar' 
        }
      }
    ];

    await whatsappService.buttonBeginTestMessage(to, titleBodyText, menuMessage, buttons);
  }
//#endregion

//#region Mesaje para que el usuario decida si quiere o no que lo tengan en cuenta para futuras propuestas
  async sendRejectionMessage(to) {
    const titleBodyText = `Futuras oportunidades en Stefanini.`
    const menuMessage = `Si te gustaría que te consideremos para próximas vacantes, presiona *Sí*. O si por ahora prefieres no recibir más información, puedes presionar *No*.\n\n¡Esperamos tener la oportunidad de trabajar juntos en el futuro! 😊`
    const buttons = [
      {
        type: 'reply',
        reply: { 
          id: 'option_3', 
          title: 'Si' 
        }
      },
      {
        type: 'reply', 
        reply: 
        { 
          id: 'option_4', 
          title: 'No'
        }
      }
    ];

    await whatsappService.buttonBeginTestMessage(to, titleBodyText, menuMessage, buttons);
  };
//#endregion
  
//#region Mensaje para la actualización de la hoja de vida del candidato una vez rechazada la vancante actual
  async sendDataUpdate(to) {
    await whatsappService.buttonDataUpdate(to);
  };
//#endregion

//#region Mensaje del envío de la validación técnica
  async sendTest(to) {
    try {
        const tecnicalTestProof = await sendTechnicalTest(
            this.conversationData.vacante,  
            "6",  
            this.conversationData.levelExperience  
        );

        //logger.info(tecnicalTestProof);
        this.conversationData.tecnicalTestProof = tecnicalTestProof;

        await whatsappService.sendMessage(to, tecnicalTestProof);

    } catch (error) {
        console.error(`Error en sendTest: ${error.message}`);

        await whatsappService.sendMessage(to, "Ocurrió un error al obtener la validación técnica. Por favor, intenta nuevamente más tarde.");
    }
  };
//#endregion

//#region Mensaje para el envío del feedback
  async sendFeedback(to) {
    try {

      if (!this.conversationData.tecnicalTestResponse) {
        await whatsappService.sendMessage(to, "No hemos recibido respuestas válidas.");
        return;
      }
       // Ejecutar ambas solicitudes en paralelo
    const [feedbackTestResponse, feedbackTestResponseComplete] = await Promise.all([
        sendFeedBackTest(
          this.conversationData.tecnicalTestResponse,
          this.conversationData.tecnicalTestProof,
          this.conversationData.vacante,
          this.conversationData.levelExperience
        ),
        sendFeedBackTestComplete(
          this.conversationData.tecnicalTestResponse,
          this.conversationData.tecnicalTestProof,
          this.conversationData.vacante,
          this.conversationData.levelExperience
        ) 
       ]);

       logger.info("Json recibido: ", JSON.stringify(feedbackTestResponse, null, 2));

       //Feedback enviado al candidato
       this.conversationData.feedbackTestResponse = feedbackTestResponse;
       //Feedback enviado al Analista
       this.conversationData.feedbackTestResponsePartial = feedbackTestResponseComplete;


       await whatsappService.sendMessage(to, feedbackTestResponse);

       await this.sendEmailConfimation(to);

    } catch (error) {
      logger.info(`Error en sendFeedback: ${error.message}`);
      console.error(error)
      await whatsappService.sendMessage(to, "Ocurrió un error al obtener el feedback de la validación técnica");
    }
  };
//#endregion

//#region Mensaje de confirmación al analista de la presentación de la prueba
  async sendEmailConfimation(to) {
    try {
      if (!this.conversationData.tecnicalTestResponse) {
        await whatsappService.sendMessage(to, "No hemos recibido respuestas válidas.");
        return;
      }

      const resultado = this.conversationData.feedbackTestResponse.startsWith("Aprobó: Sí") ? "Aprobado" : "No Aprobado";
      
      const formattedTestProof = fomrtearTextoParaHTML(this.conversationData.tecnicalTestProof);
      const formattedSimpleFeedback = fomrtearTextoParaHTML(this.conversationData.feedbackTestResponse);
      const formattedTestProofComplete = fomrtearTextoParaHTML(this.conversationData.feedbackTestResponsePartial);
      
      const emailConfirmation = await sendEmailVerify(
        this.conversationData.nombre,
        this.conversationData.vacante,
        formattedTestProof,
        formattedSimpleFeedback, 
        formattedTestProofComplete,
        resultado,  
        this.conversationData.email_analista
      );
  
      // Puedes notificar al usuario que el correo fue enviado o simplemente omitir este mensaje
       await whatsappService.sendMessage(to, "_Correo de confirmación enviado al analista._");

       logger.info(`El resultado es: ${resultado}`);

       let resultadoFavorable; 

       if (resultado === "Aprobado"){
        resultadoFavorable = `${this.conversationData.nombre} ¡Felicitaciones! 🎉, continuas a la siguiente fase, un Analista se contactará contigo para guiarte en el proceso. \nPor favor diligencia el siguiente formulario: 🔗 https://tally.so/r/3X2KRg`
       }
       else {
        resultadoFavorable = `${this.conversationData.nombre} No has sido  seleccionado para la siguiente fase 😕, agradecemos tu participación en el proceso, sin embargo, si quieres participar en futuros procesos, Por favor diligencia el siguiente formulario: 🔗 https://tally.so/r/meYd1e`
       }; 

       await whatsappService.sendMessage(to, resultadoFavorable);
      
    } catch (error) {
      console.error(`Error en sendEmailConfimation: ${error.message}`);
      await whatsappService.sendMessage(to, "Ocurrió un error al enviar el correo de confirmación");
    }
  };
//#endregion
  
}

export default new MessageHandler();