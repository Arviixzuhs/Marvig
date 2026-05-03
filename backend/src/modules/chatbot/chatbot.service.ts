import { Injectable, Logger } from '@nestjs/common';
import { GroqProvider } from './providers/groq.provider';
import { ChatbotToolsExecutor } from './tools/chatbot-tools.executor';
import { getToolsForRole } from './tools/chatbot-tools.registry';
import { ChatMessage, ChatRequestDto } from './interfaces/chatbot.interface';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  constructor(
    private readonly groqProvider: GroqProvider,
    private readonly toolsExecutor: ChatbotToolsExecutor,
  ) {}

  async processMessage(request: ChatRequestDto, user: any): Promise<any> {
    const role = user?.role || 'GUEST';
    
    let systemPrompt = `Eres el asistente virtual experto de la Posada Marvig. Eres amable, profesional y conciso. Ayudas a los usuarios con información sobre la posada, reservas y disponibilidad. Manten siempre respuestas breves y directas.

REGLAS ESTRICTAS Y OBLIGATORIAS:
1. NUNCA inventes, asumas o adivines fechas, cantidad de huéspedes o IDs de apartamentos. Si falta algún dato, DEBES pedírselo al usuario antes de ejecutar cualquier herramienta.
2. NUNCA ejecutes "crear_reserva" sin antes haber consultado disponibilidad, mostrado las opciones al cliente y recibido su CONFIRMACIÓN EXPLÍCITA de qué apartamento desea.
3. Si el usuario solo saluda (ej: "hola"), simplemente saluda de vuelta y ofrécele ayuda. NO ejecutes herramientas hasta que el usuario exprese una intención clara.
4. Al mostrar listas de apartamentos, usa SIEMPRE listas numeradas de Markdown con un doble salto de línea entre cada elemento para que se rendericen correctamente como una lista en la interfaz. Cada opción debe ser clara y estar bien separada.`;
    
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      systemPrompt += `\nATENCIÓN: Estás hablando con un administrador del sistema. Tienes acceso a herramientas avanzadas y financieras. Puedes ofrecer resúmenes de egresos, balances e información interna.`;
    } else {
      systemPrompt += `\nEstás hablando con un cliente autenticado. Ayúdalo a reservar y a consultar disponibilidad.`;
    }

    const tools = getToolsForRole(role);
    
    const history: ChatMessage[] = request.history || [];
    history.push({ role: 'user', content: request.message });

    let response = await this.groqProvider.generateResponse(systemPrompt, history, tools);

    // Bucle para soportar múltiples llamadas a tools (max 5 iteraciones por seguridad)
    let iteraciones = 0;
    while (response.toolCalls && response.toolCalls.length > 0 && iteraciones < 5) {
      iteraciones++;
      this.logger.log(`[Iteración ${iteraciones}] Groq solicitó ejecutar tools: ${response.toolCalls.map((tc: any) => tc.name).join(', ')}`);
      
      history.push({
        role: 'assistant',
        content: response.content || '',
        toolCalls: response.toolCalls
      });

      for (const toolCall of response.toolCalls) {
        this.logger.debug(`Ejecutando tool individual: ${toolCall.name}`);
        const result = await this.toolsExecutor.executeTool(toolCall.name, toolCall.args, user);
        this.logger.debug(`Tool ${toolCall.name} completada. Resultado: ${JSON.stringify(result)}`);
        
        history.push({
          role: 'tool',
          content: JSON.stringify(result),
          toolCallId: toolCall.id
        });
      }

      this.logger.debug(`Haciendo llamada a Groq con los resultados (Iteración ${iteraciones})...`);
      response = await this.groqProvider.generateResponse(systemPrompt, history, tools);
      this.logger.debug(`Llamada a Groq completada. Respuesta parcial: ${JSON.stringify(response)}`);
    }

    if (iteraciones >= 5) {
      this.logger.warn(`Se alcanzó el límite de iteraciones de Function Calling.`);
    }

    history.push({ role: 'assistant', content: response.content || 'Hubo un problema al procesar la respuesta final.' });
    
    return {
      message: response.content || 'Hubo un problema al procesar la respuesta final.',
      history: history
    };
  }
}
