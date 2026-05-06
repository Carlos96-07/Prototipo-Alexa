from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
from app.services.llm_service import LLMService

router = APIRouter()
llm_service = LLMService()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print("Nuevo cliente WebSocket conectado")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        print("Cliente WebSocket desconectado")

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_text(json.dumps(message))

manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
                user_text = payload.get("text", "")
                
                print(f"Usuario dice: {user_text}")
                
                # Procesar comando con el LLM service (o fallback)
                result = llm_service.get_response(user_text)
                
                # Preparar respuesta al cliente
                response_data = {
                    "response": result.get("response", "Lo siento, hubo un error."),
                    "action": result.get("action", None),
                    "status": "speaking"
                }
                
                await manager.send_personal_message(response_data, websocket)
                
            except json.JSONDecodeError:
                print("Error decodificando JSON")
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"Error inesperado: {e}")
        manager.disconnect(websocket)
