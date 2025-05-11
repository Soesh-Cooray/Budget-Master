from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.signals import post_migrate
from django.dispatch import receiver

class TransactionType(models.TextChoices):
    EXPENSE = 'expense', 'Expense'
    INCOME = 'income', 'Income'

class Category(models.Model):
    name = models.CharField(max_length=100)
    transaction_type = models.CharField(
        max_length=10,
        choices=TransactionType.choices,
        default=TransactionType.EXPENSE
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    is_default = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.name} ({self.get_transaction_type_display()})"
    
    class Meta:
        verbose_name_plural = "Categories"
        unique_together = ['name', 'transaction_type', 'user']

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(default=timezone.now)
    description = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    transaction_type = models.CharField(
        max_length=10,
        choices=TransactionType.choices,
        default=TransactionType.EXPENSE
    )
    
    def __str__(self):
        return f"{self.get_transaction_type_display()}: {self.amount} - {self.description}"

# Function to create default categories after migrations
@receiver(post_migrate)
def create_default_categories(sender, **kwargs):
    # Only run this when our app is migrated
    if sender.name == 'budget':  # Make sure this is your app name!
        # Avoid circular import
        from django.apps import apps
        Category = apps.get_model('budget', 'Category')
        
        default_expense_categories = [
            'Housing', 'Food', 'Transportation', 'Entertainment', 
            'Shopping', 'Healthcare', 'Utilities'
        ]
        
        default_income_categories = [
            'Salary', 'Freelance', 'Investment', 'Other'
        ]
        
        # Create default expense categories
        for category_name in default_expense_categories:
            Category.objects.get_or_create(
                name=category_name,
                transaction_type=TransactionType.EXPENSE,
                is_default=True,
                user=None  # None indicates it's a system default category
            )
        
        # Create default income categories
        for category_name in default_income_categories:
            Category.objects.get_or_create(
                name=category_name,
                transaction_type=TransactionType.INCOME,
                is_default=True,
                user=None  # None indicates it's a system default category
            )