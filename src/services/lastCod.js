import whatsappService from './whatsappService.js';
import sendTechnicalTest from '../services/httpRequest/sendExternalMessage.js';
import logger from '../utils/logger.js';


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


class MessageHandler {

  constructor() {
    this.conversationData = new ConversationData(); 
  }

  async handleIncomingMessage(message) {
    logger.info(JSON.stringify(message?.text?.body));
    logger.info(JSON.stringify(message?.interactive?.button_reply?.id));
    
    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim();
      
      if(this.isGreeting(incomingMessage)){
        await this.sendWelcomeMessage(message.from);
        await this.sendWelcomeMenu(message.from);
      } else {
        const response = `Echo: ${message.text.body}`;
        await whatsappService.sendMessage(message.from, response);
      }
      await whatsappService.markAsRead(message.id);

    }
    else if (message?.type === 'interactive' && message?.interactive?.button_reply?.id === 'option_1') {
      await this.sendProofMessage(message.from);
      await whatsappService.markAsRead(message.id);
    } 
    else if (message?.type === 'interactive' && message?.interactive?.button_reply?.id === 'option_2') {
      await this.sendRejectionMessage(message.from);
      await whatsappService.markAsRead(message.id);
    }
    else if (message?.type === 'interactive' && message?.interactive?.button_reply?.id === 'option_4') {
      await whatsappService.sendMessage(message.from, "Gracias por su respuesta.");
      await whatsappService.markAsRead(message.id);
    }
    else if (message?.type === 'interactive' && message?.interactive?.button_reply?.id === 'option_Empezar') {
      await this.sendTest(message.from);  // Llama a la nueva función cuando el usuario elige "Empezar"
      await whatsappService.markAsRead(message.id);
    }
  
  }

//*Mensajes de tipo texto
  isGreeting(message) {
    const greetings = ["start"];
    return greetings.includes(message);
  }

  async sendWelcomeMessage(to, messageId) {
    const conversationData = new ConversationData();
    var mensajeInvitacion = generarMensajeInvitacion(conversationData.nombre, conversationData.vacante, conversationData.descripcion, conversationData.ubicacion, conversationData.beneficios, conversationData.tuNombre, conversationData.posicion, conversationData.empresa);
    await whatsappService.sendMessage(to, mensajeInvitacion, messageId);
  }
  
//* Mesajes de tipo interactivos
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

  async sendProofMessage(to) {
    const titleBodyText = `Gracias por participar en nuestra vacante.`
    const menuMessage = ` ${this.conversationData.nombre}, te presentaremos una prueba de 6 preguntas para evaluar tus habilidades. Esta prueba es parte del proceso de selección.\n\nAntes de presionar *_Empezar_* lee con atención las siguientes instrucciones.\n\n*Instrucciones.* \n\n1. Envía las respuestas en un solo mensaje iniciando con la palabra: _Respuestas_. Ejemplo: Respuesta 1: A, Respuesta 2: B...\n2. Lee bien la prueba antes de contestar. \n3. Tienes 3 días para iniciar la prueba y, una vez que comiences, dispondrás de 30 minutos para completarla.\n4. Al dar clic en *_Empezar_*, aceptas nuestra política de tratamiento de datos.\n\nSiguiendo estas indicaciones, asegurarás que todo el proceso transcurra sin problemas. ¡Éxito!`
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

  async sendRejectionMessage(to) {
    const titleBodyText = `Mantengamos la puerta abierta a futuras colaboraciones.`
    const menuMessage = "Nos encantaría saber si te gustaría considerar futuras oportunidades para unirte a Stefanini. Sería un placer mantenernos en contacto y explorar juntos cómo podríamos colaborar en el futuro."
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
  }

  async sendTest(to) {
    try {
        const tecnicalTestResponse = await sendTechnicalTest(
            this.conversationData.vacante,  
            "6",  
            this.conversationData.levelExperience  
        );

        logger.info(tecnicalTestResponse);

        await whatsappService.sendMessage(to, tecnicalTestResponse);

    } catch (error) {
        console.error(`Error en sendTest: ${error.message}`);

        await whatsappService.sendMessage(to, "Ocurrió un error al obtener la prueba técnica. Por favor, intenta nuevamente más tarde.");
    }
  }

}

export default new MessageHandler();