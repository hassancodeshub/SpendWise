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
    
    // [FUTURE JS METHODS GO HERE]
};

// boot it up
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});