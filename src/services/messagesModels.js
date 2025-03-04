
function messageText(textResponse, number) {
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "text",
        "text": {
            "body": textResponse
        }
    }, null, 2);

    return data; 
}

function acceptanceParticipationMessage(number) {
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "header": {
                "type": "text",
                "text": "Te gustaría participar en la vancate?"
            },
            "body": {
                "text": "Selecciona una opción:"
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "001",
                            "title": "Si"
                        }
                    },
                    {
                        "type": "reply",
                        "reply": {
                            "id": "002",
                            "title": "No"
                        }
                    },
                ]
            }
        }
    }, null, 2);

    return data; 
}

function interesSelectionMessage(number) {
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "header": {
                "type": "text",
                "text": "Mantengamos la Puerta Abierta a Futuras Colaboraciones."
            },
            "body": {
                "text": "Nos encantaría saber si te gustaría considerar futuras oportunidades para unirte a Stefanini. Sería un placer mantenernos en contacto y explorar juntos cómo podríamos colaborar en el futuro."
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "interes_si",
                            "title": "Si me interesa."
                        }
                    },
                    {
                        "type": "reply",
                        "reply": {
                            "id": "interes_no",
                            "title": "No me interesa."
                        }
                    }
                ]
            }
        }
    }, null, 2);

    return data; 
}

function buttonBeginTestMessage(number) {
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": "573138920888",
        "type": "interactive",
        "interactive": {
            "type": "button",
            "header": {
                "type": "text",
                "text": "Gracias por participar en nuestra vacante"
            },
            "body": {
                "text": "Te presentaremos una prueba de 6 preguntas para evaluar tus habilidades. Esta prueba es parte del proceso de selección.\n\nAntes de presionar *_Empezar_* lee con atención las siguientes instrucciones.\n\n*Instrucciones.* \n1. Envía las respuestas en un solo mensaje iniciando con la palabra: _Respuestas_\n2. Lee bien la prueba antes de contestar. \n3. Tienes 3 días para iniciar la prueba y, una vez que comiences, dispondrás de 30 minutos para completarla.\n\nSiguiendo estas indicaciones, asegurarás que todo el proceso transcurra sin problemas. ¡Éxito!"
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "E001",
                            "title": "Empezar"
                        }
                    }
                ]
            }
        }
    }
    , null, 2);

    return data; 
}


function buttonSelectionMessageFuture(number) {
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "header": {
                "type": "text",
                "text": "Gracias por tu respuesta. ¿Te gustaría trabajar en un futuro con?"
            },
            "body": {
                "text": "Selecciona una opción:"
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "future_yes",
                            "title": "Si"
                        }
                    },
                    {
                        "type": "reply",
                        "reply": {
                            "id": "future_no",
                            "title": "No"
                        }
                    },
                ]
            }
        }
    }, null, 2);

    return data; 
}

function SelectionMessageLinkUpdate(number) {
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": number,
        "type": "text",
        "text": {
            "preview_url": false,
            "body": "Ingresa a este link, actualiza y envia tus datos para poder estar en contacto\n\nhttps://whatsform.com/TzSh0s"
        }
    }, null, 2);

    return data; 
}

function SelectionMessageLinkDate(number) {
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": number,
        "type": "text",
        "text": {
            "preview_url": false,
            "body": "Recuerda que debes disponer con tiempo para realizar la prueba. Ingresa al siguiente link para que puedas agendar un espacio:\n\nhttps://whatsform.com/fLCBQS"
        }
    }, null, 2);

    return data; 
}



module.exports ={
    messageText,
    acceptanceParticipationMessage,
    buttonBeginTestMessage,
    buttonSelectionMessageFuture,
    interesSelectionMessage,
    SelectionMessageLinkUpdate,
    SelectionMessageLinkDate
}