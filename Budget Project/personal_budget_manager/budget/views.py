from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from .models import Transaction, Category, TransactionType, Budget
from .serializers import TransactionSerializer, CategorySerializer, BudgetSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Return system default categories and user's custom categories
        return Category.objects.filter(
            models.Q(user=self.request.user) | models.Q(is_default=True)
        )
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user, is_default=False)
    
    @action(detail=False, methods=['get'])
    def expense_categories(self, request):
        categories = self.get_queryset().filter(transaction_type=TransactionType.EXPENSE)
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def income_categories(self, request):
        categories = self.get_queryset().filter(transaction_type=TransactionType.INCOME)
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def savings_categories(self, request):
        categories = self.get_queryset().filter(transaction_type=TransactionType.SAVINGS)
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-date')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def expenses(self, request):
        expenses = self.get_queryset().filter(transaction_type=TransactionType.EXPENSE)
        serializer = self.get_serializer(expenses, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def income(self, request):
        income = self.get_queryset().filter(transaction_type=TransactionType.INCOME)
        serializer = self.get_serializer(income, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def savings(self, request):
        savings = self.get_queryset().filter(transaction_type=TransactionType.SAVINGS)
        serializer = self.get_serializer(savings, many=True)
        return Response(serializer.data)

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)