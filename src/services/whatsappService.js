import sendToWhatsApp  from '../services/httpRequest/sendToWhatsapp.js';

class WhatsAppService {
  async sendMessage(to, body) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      text: { body },
    };

    await sendToWhatsApp(data);
  }

  async markAsRead(messageId) {
    const data = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    };

    await sendToWhatsApp(data);
  }

  async sendInteractiveButtons(to, TitleBodyText, BodyText, buttons) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        "header": {
                "type": "text",
                "text": TitleBodyText
            },
        body: {  
          text: BodyText 
        },
        action: {
          buttons: buttons
        }
      }
    }
    await sendToWhatsApp(data);
  }

  async buttonBeginTestMessage(to, TitleBodyText, BodyText, buttons) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        "header": {
                "type": "text",
                "text": TitleBodyText
            },
        body: {  
          text: BodyText 
        },
        action: {
          buttons: buttons
        }
      }
    }
    await sendToWhatsApp(data);
  }

  async buttonDataUpdate(to) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: {
        "preview_url": true,
        "body": "Para que podamos tener en cuenta tu perfil en futuras oportunidades, te invitamos a actualizar tu información.\nIngresa al siguiente enlace y completa tus datos para mantenernos en contacto: 🔗 https://tally.so/r/meYd1e"
      }
    }
    await sendToWhatsApp(data);
  }

}

export default new WhatsAppService();