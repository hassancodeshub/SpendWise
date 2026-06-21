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
