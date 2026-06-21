var db_state = null; // storing global app data
const ST_KEY = 'spendwise_student_data';

// hardcoded rotating tips
function getTip() {
    var t = [
        "Don't order Zomato at 2 AM, it drains the wallet.",
        "Track the chai/sutta expenses, they add up faster than tuition fees.",
        "Use student IDs for Spotify and Apple Music.",
        "If you're broke, it's Maggi time.",
        "Tracking every single transaction reveals where your money is leaking."
    ];
    return t[Math.floor(Math.random() * t.length)];
}

// bad custom hash for local pin so it's not plaintext in dev tools
function doHash(s) {
    let x = 0;
    for(let i=0; i<s.length; i++) {
        x = ((x<<5)-x)+s.charCodeAt(i); 
        x = x&x; 
    }
    return Math.abs(x).toString(16);
}

function startAppFlow() {
    var overlay = document.getElementById('login-overlay');
    var wrapper = document.getElementById('secure-app-wrapper');
    // completely hide dom until pin is entered
    wrapper.style.visibility = 'hidden'; 
    wrapper.style.opacity = '0';

    if(db_state.prof.n == '' || db_state.prof.pHash == '') {
        overlay.classList.add('active');
        document.getElementById('setup-form').classList.remove('hidden');
        document.getElementById('auth-form').classList.add('hidden');
        document.getElementById('login-title').innerText = "Setup SpendWise";

        document.getElementById('setup-form').onsubmit = function(e) {
            e.preventDefault();
            var p1 = document.getElementById('setup-pin').value;
            var p2 = document.getElementById('setup-pin-confirm').value;
            if(p1 != p2) { showMsg("Pins do not match bro", "error"); return; }

            // basic replace to stop XSS breaking json structure
            db_state.prof.n = document.getElementById('setup-name').value.replace(/[<>]/g, "");
            db_state.prof.budget_base = parseFloat(document.getElementById('setup-budget').value).toFixed(2);
            db_state.prof.pHash = doHash(p1);
            localStorage.setItem(ST_KEY, JSON.stringify(db_state));
            
            overlay.classList.remove('active');
            wrapper.style.visibility = 'visible'; wrapper.style.opacity = '1';
            setupAllTheEvents();
        }
    } else {
        overlay.classList.add('active');
        document.getElementById('setup-form').classList.add('hidden');
        document.getElementById('auth-form').classList.remove('hidden');
        document.getElementById('login-title').innerText = "Wassup, " + db_state.prof.n;

        document.getElementById('auth-form').onsubmit = function(e) {
            e.preventDefault();
            var entered = document.getElementById('auth-pin').value;
            if(doHash(entered) == db_state.prof.pHash) {
                overlay.classList.remove('active');
                document.getElementById('auth-pin').value = '';
                wrapper.style.visibility = 'visible'; wrapper.style.opacity = '1';
                setupAllTheEvents();
            } else {
                showMsg("Incorrect PIN", "error");
            }
        }
    }
}

// simple toast
var tmr = null;
function showMsg(m, t) {
    var box = document.getElementById('toast-container');
    var d = document.createElement('div');
    d.className = 'toast ' + (t || 'info');
    d.innerText = m;
    box.appendChild(d);
    if(tmr) clearTimeout(tmr);
    tmr = setTimeout(function(){
        d.style.opacity = '0';
        setTimeout(function(){ d.remove(); }, 300);
    }, 2500);
}

var isSetupDone = false;

function forceUIUpdate() {
    var prf = db_state.prof;
    document.getElementById('set-name').value = prf.n;
    document.getElementById('set-currency').value = prf.curr;
    document.getElementById('greeting').innerText = "Hello, " + prf.n;
    document.getElementById('current-month-display').innerText = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    var mon = new Date().getMonth();
    var yr = new Date().getFullYear();
    var pocket_money = parseFloat(prf.budget_base);
    var kharcha = 0;
    
    // inline filter avoiding UTC shifting
    var this_mo_txs = [];
    for(var k=0; k<db_state.txs.length; k++) {
        var dparts = db_state.txs[k].date.split('-');
        if(parseInt(dparts[1])-1 == mon && parseInt(dparts[0]) == yr) {
            this_mo_txs.push(db_state.txs[k]);
            if(db_state.txs[k].type == 'income') pocket_money += parseFloat(db_state.txs[k].amount);
            else kharcha += parseFloat(db_state.txs[k].amount);
        }
    }

    var available = pocket_money - kharcha;
    var d_in_m = new Date(yr, mon+1, 0).getDate();
    var r_days = d_in_m - new Date().getDate() + 1;
    if(r_days<1) r_days=1;
    var daily_allowance = available > 0 ? available/r_days : 0;

    document.getElementById('dash-budget').innerText = prf.curr + pocket_money.toFixed(2);
    document.getElementById('dash-spent').innerText = prf.curr + kharcha.toFixed(2);
    document.getElementById('dash-remaining').innerText = prf.curr + available.toFixed(2);
    
    if(available < 0) {
        document.getElementById('dash-remaining-card').classList.add('danger');
        document.getElementById('dash-remaining').style.color = 'var(--danger)';
    } else {
        document.getElementById('dash-remaining-card').classList.remove('danger');
        document.getElementById('dash-remaining').style.color = '';
    }

    document.getElementById('dash-safe-weekly').innerText = prf.curr + (daily_allowance*7).toFixed(2);
    document.getElementById('dash-safe-daily').innerText = prf.curr + daily_allowance.toFixed(2);

    var no_spend = 0;
    for(let d=1; d<=new Date().getDate(); d++) {
        var did_spend = false;
        var check_str = yr + '-' + String(mon+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
        for(let t=0; t<this_mo_txs.length; t++) {
            if(this_mo_txs[t].date == check_str && this_mo_txs[t].type == 'expense') did_spend = true;
        }
        if(!did_spend) no_spend++;
    }
    document.getElementById('dash-no-spend').innerText = no_spend;

    var pct = 0;
    if(pocket_money > 0) pct = Math.min((kharcha/pocket_money)*100, 100);
    
    var pb = document.getElementById('dash-progress-bar');
    pb.style.width = pct + '%';
    document.getElementById('dash-progress-text').innerText = pct.toFixed(1) + '% utilized';
    if(pct>=100) pb.style.backgroundColor = 'var(--danger)';
    else if(pct>80) pb.style.backgroundColor = 'orange';
    else if(pct>50) pb.style.backgroundColor = 'var(--warning)';
    else pb.style.backgroundColor = 'var(--success)';

    drawTable(document.getElementById('dash-expense-list'), db_state.txs.slice(0,5), false);
    drawTable(document.getElementById('expenses-full-list'), db_state.txs, true);
    buildGoalsUI();
}

function drawTable(domEl, arr, canEdit) {
    if(!arr || arr.length==0) { domEl.innerHTML = '<p class="empty-state-small">Empty ledger.</p>'; return; }
    var str = '';
    for(var i=0; i<arr.length; i++) {
        var x = arr[i];
        var isInc = x.type == 'income';
        var dp = x.date.split('-');
        var nd = new Date(dp[0], dp[1]-1, dp[2]).toLocaleDateString(undefined, {month:'short', day:'numeric'});
        
        var tclr = isInc ? 'text-success' : '';
        var tsign = isInc ? '+' : '-';
        
        var delHTML = canEdit ? `<button class="btn btn-text text-danger" style="font-size:0.8rem; margin-top:4px;" onclick="killRow('${x.id}')">Delete</button>` : '';
        var s_title = x.title.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

        str += `<div class="expense-item">
            <div class="expense-info">
                <h4>${s_title}</h4>
                <span class="expense-meta">${x.category} • ${nd}</span>
            </div>
            <div style="text-align:right">
                <div class="expense-amount ${tclr}">${tsign}${db_state.prof.curr}${parseFloat(x.amount).toFixed(2)}</div>
                ${delHTML}
            </div>
        </div>`;
    }
    domEl.innerHTML = str;
}

window.killRow = function(id) {
    if(confirm("Sure?")) {
        db_state.txs = db_state.txs.filter(function(t){ return t.id != id; });
        localStorage.setItem(ST_KEY, JSON.stringify(db_state));
        forceUIUpdate();
    }
};

function buildGoalsUI() {
    var gl = document.getElementById('goals-list');
    if(!db_state.gls || db_state.gls.length==0) { gl.innerHTML = '<p class="empty-state-small">No goals.</p>'; return; }
    
    var html = '';
    for(var i=0; i<db_state.gls.length; i++) {
        var g = db_state.gls[i];
        var p = Math.min((g.current/g.target)*100, 100).toFixed(1);
        var dp = g.deadline.split('-');
        var dl = Math.ceil((new Date(dp[0], dp[1]-1, dp[2]) - new Date()) / 86400000);
        var timeStr = dl < 0 ? "Past deadline" : (dl === 0 ? "Due today" : `${dl} days left`);
        
        html += `<div class="card goal-card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <h3>${g.name.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</h3>
                <button class="btn btn-text text-danger" style="font-size:0.8rem" onclick="killGoal('${g.id}')">Drop</button>
            </div>
            <div class="goal-meta">Target: ${db_state.prof.curr}${g.target.toFixed(2)}</div>
            <div class="progress-bar-container"><div class="progress-bar" style="width:${p}%; background-color:var(--emerald);"></div></div>
            <div class="goal-stats"><span>Saved: ${db_state.prof.curr}${g.current.toFixed(2)}</span><span>${timeStr}</span></div>
        </div>`;
    }
    gl.innerHTML = html;
}

window.killGoal = function(id) {
    if(confirm("Drop goal?")) {
        db_state.gls = db_state.gls.filter(function(x){ return x.id != id; });
        localStorage.setItem(ST_KEY, JSON.stringify(db_state));
        buildGoalsUI();
    }
};


                                
