from django.shortcuts import render


def index(request):
    """Render the main index page (replaces React SPA)."""
    return render(request, 'index.html')
