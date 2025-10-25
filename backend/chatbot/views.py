from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import ChatMessage
from .serializers import ChatMessageSerializer
from django.conf import settings
import os


def get_campus_context():
    """Get campus-specific context for the chatbot"""
    return """
You are a helpful assistant for KLH University's Smart Campus Hub. You help students, faculty, and staff with:

1. Lost & Found: Help users report lost items, search for found items, and claim items
2. Events: Information about upcoming campus events, how to register, event categories
3. Feedback: How to submit feedback or grievances, track feedback status
4. Clubs: Information about student clubs, how to join clubs, club activities
5. General Campus Info: Operating hours, facilities, contact information

Be friendly, concise, and helpful. When users ask about specific items or events, encourage them to use the appropriate sections of the platform.
"""


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat(request):
    """Chat endpoint using Gemini API"""
    
    message = request.data.get('message', '')
    
    if not message:
        return Response(
            {'error': 'Message is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if Gemini API key is configured
    api_key = settings.GEMINI_API_KEY
    
    if not api_key:
        # Fallback response if API key not configured
        response_text = "Campus chatbot is not configured. Please contact the administrator to set up the Gemini API key."
    else:
        try:
            import google.generativeai as genai
            
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-pro')
            
            # Build context with campus information
            prompt = f"""{get_campus_context()}

User question: {message}

Please provide a helpful response:"""
            
            response = model.generate_content(prompt)
            response_text = response.text
            
        except ImportError:
            response_text = "Gemini API library not installed. Please install google-generativeai package."
        except Exception as e:
            response_text = f"Error processing your request: {str(e)}"
    
    # Save chat message
    chat_message = ChatMessage.objects.create(
        user=request.user,
        message=message,
        response=response_text
    )
    
    return Response({
        'message': message,
        'response': response_text
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_history(request):
    """Get chat history for current user"""
    messages = ChatMessage.objects.filter(user=request.user)[:20]
    serializer = ChatMessageSerializer(messages, many=True)
    return Response(serializer.data)
