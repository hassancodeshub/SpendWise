// main app controller
const App = {
    transactions: [],
    budgets: [],
    goals: [],
    settings: { theme: 'light', currency: '₹' },
    
    init() {
        this.loadData();
        this.applyTheme();
        console.log("App booted up.");
    },
    
    // --- STORAGE ---
    saveData() {
        const data = {
            transactions: this.transactions,
            budgets: this.budgets,
            goals: this.goals,
            settings: this.settings,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('expenseTrackerData', JSON.stringify(data));
    },
    
    loadData() {
        const stored = localStorage.getItem('expenseTrackerData');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.transactions = data.transactions || [];
                this.budgets = data.budgets || [];
                this.goals = data.goals || [];
                this.settings = data.settings || { theme: 'light', currency: '₹' };
                this.applyTheme();
            } catch (e) {
                console.error('Failed to parse local storage', e);
                this.setDefaultData();
            }
        } else {
            this.setDefaultData();
        }
    },
    
    setDefaultData() {
        this.transactions = [
            { id: Date.now() + 1, type: 'income', category: 'Salary', amount: 45000, date: new Date().toISOString().split('T')[0], description: 'Initial Salary', paymentMethod: 'Bank', notes: '' }
        ];
        this.budgets = [];
        this.goals = [];
        this.saveData();
    },
    
    // --- THEME ---
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.textContent = this.settings.theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
    },
    
    toggleTheme() {
        this.settings.theme = this.settings.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.saveData();
    }
    
    ,
    // --- TRANSACTIONS CRUD ---
    addTransaction(data) {
        const transaction = { id: Date.now(), ...data, createdAt: new Date().toISOString() };
        this.transactions.unshift(transaction);
        this.saveData();
        this.render();
    },
    
    deleteTransaction(id) {
        if (!confirm('Are you sure you want to delete this?')) return;
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveData();
        this.render();
    },
    
    getTransaction(id) {
        return this.transactions.find(t => t.id === id);
    },

    getStats(transactions) {
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return { totalIncome, totalExpenses, netBalance: totalIncome - totalExpenses };
    },

     render() {
        this.renderDashboard();
    },

    renderDashboard() {
        const stats = this.getStats(this.transactions);
        document.getElementById('totalIncome').textContent = `${this.settings.currency}${stats.totalIncome.toLocaleString()}`;
        document.getElementById('totalExpenses').textContent = `${this.settings.currency}${stats.totalExpenses.toLocaleString()}`;
        
        const balEl = document.getElementById('netBalance');
        balEl.textContent = `${this.settings.currency}${stats.netBalance.toLocaleString()}`;
        balEl.className = stats.netBalance >= 0 ? 'stat-amount positive' : 'stat-amount negative';
        document.getElementById('transactionCount').textContent = this.transactions.length;
    }
    
    ,
    editTransaction(id, updates) {
        const index = this.transactions.findIndex(t => t.id === id);
        if (index === -1) return;
        this.transactions[index] = { ...this.transactions[index], ...updates, updatedAt: new Date().toISOString() };
        this.saveData();
        this.render();
        this.showToast('Updated successfully!', 'success');
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    openEditModal(id) {
        const t = this.getTransaction(id);
        if (!t) return;
        document.getElementById('editModal').classList.add('active');
        document.getElementById('editId').value = t.id;
        document.getElementById('editType').value = t.type;
        document.getElementById('editCategory').value = t.category;
        document.getElementById('editAmount').value = t.amount;
        document.getElementById('editDate').value = t.date;
        document.getElementById('editDescription').value = t.description;
        document.getElementById('editPaymentMethod').value = t.paymentMethod || 'Cash';
        document.getElementById('editNotes').value = t.notes || '';
    },
    
    openBudgetModal() { document.getElementById('budgetModal').classList.add('active'); },
    openGoalModal() { document.getElementById('goalModal').classList.add('active'); },
    
    openAddFundsModal(goalId) {
        document.getElementById('fundGoalId').value = goalId;
        document.getElementById('fundAmount').value = '';
        document.getElementById('addFundsModal').classList.add('active');
    }

    // [FUTURE JS METHODS GO HERE]

};

// boot it up
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});