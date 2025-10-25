from rest_framework import permissions


class IsStudent(permissions.BasePermission):
    """
    Permission check for student role
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'student'


class IsFaculty(permissions.BasePermission):
    """
    Permission check for faculty role
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'faculty'


class IsAdmin(permissions.BasePermission):
    """
    Permission check for admin role
    Admins have full access to everything
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'
    
    def has_object_permission(self, request, view, obj):
        # Admins can do everything
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsFacultyOrAdmin(permissions.BasePermission):
    """
    Permission check for faculty or admin roles
    Admins and faculty can create and manage content
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['faculty', 'admin']
    
    def has_object_permission(self, request, view, obj):
        # Admins can edit everything, faculty can edit their own
        if request.user.role == 'admin':
            return True
        return request.user.role == 'faculty'


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow owners or admins to edit/delete
    Admins have full access to edit and delete everything
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True

        # Admins can edit/delete everything
        if request.user.role == 'admin':
            return True

        # Write permissions only allowed to the owner
        return obj.created_by == request.user


class IsOwnerOrFacultyOrAdmin(permissions.BasePermission):
    """
    Object-level permission for owner, faculty, or admin
    Admins have full access to edit and delete everything
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True

        # Admins can edit/delete everything
        if request.user.role == 'admin':
            return True

        # Write permissions for owner or faculty
        return (obj.created_by == request.user or 
                request.user.role == 'faculty')
