// --- INITIAL ORCHESTRATION & SPLASH SCREEN TIMER ---
document.addEventListener("DOMContentLoaded", () => {
    const splash = document.getElementById("splash-screen");
    const logoWrapper = document.querySelector(".logo-wrapper");
    const mainApp = document.getElementById("app-content");

    // Animate splash brand image elements softly in sequence
    setTimeout(() => {
        logoWrapper.classList.remove("opacity-0", "scale-90");
    }, 150);

    // Fade out splash screen wrapper out of viewport bounds
    setTimeout(() => {
        splash.classList.add("opacity-0", "pointer-events-none");
        mainApp.classList.remove("hidden");
        setTimeout(() => {
            mainApp.classList.remove("opacity-0");
        }, 50);
    }, 2200);

    setupSliders();
});

// --- SCREEN SWITCH ROUTER ---
function switchScreen(screenId) {
    // Hide all viewports
    document.querySelectorAll(".app-screen").forEach(screen => {
        screen.classList.add("hidden");
    });
    // Display current target viewport
    document.getElementById(`screen-${screenId}`).classList.remove("hidden");

    // Manage tab button states visually
    const navIds = ['understand', 'track', 'reduce'];
    navIds.forEach(id => {
        const btn = document.getElementById(`nav-${id}`);
        if (id === screenId) {
            btn.classList.add("text-[#3D5A3C]", "font-semibold");
            btn.classList.remove("text-[#A1AAA0]");
        } else {
            btn.classList.remove("text-[#3D5A3C]", "font-semibold");
            btn.classList.add("text-[#A1AAA0]");
        }
    });
}

// --- CALCULATION FORM REALTIME SYNC ENGINE ---
function setupSliders() {
    const metrics = [
        { id: 'transport', unit: ' km' },
        { id: 'diet', unit: ' meals' },
        { id: 'energy', unit: ' kWh' }
    ];

    metrics.forEach(metric => {
        const input = document.getElementById(`input-${metric.id}`);
        const label = document.getElementById(`val-${metric.id}`);
        
        input.addEventListener("input", (e) => {
            label.textContent = e.target.value + metric.unit;
        });
    });
}

// --- ESTIMATION CALCULATION FORMULAS ---
document.getElementById("btn-calculate").addEventListener("click", () => {
    const transportKm = parseFloat(document.getElementById("input-transport").value);
    const meatMeals = parseFloat(document.getElementById("input-diet").value);
    const energyKwh = parseFloat(document.getElementById("input-energy").value);

    // Simplified yearly conversion constants approximations
    const transportCO2 = (transportKm * 52 * 0.17) / 1000; // 0.17kg/km average medium gas car
    const dietCO2 = (meatMeals * 52 * 2.8) / 1000;       // 2.8kg per meat preparation lifecycle
    const energyCO2 = (energyKwh * 12 * 0.85) / 1000;     // 0.85kg/kWh grid blend approximation

    const totalCalculated = transportCO2 + dietCO2 + energyCO2;
    
    // Animate display container
    const resultBox = document.getElementById("calculator-result");
    resultBox.classList.remove("hidden");
    setTimeout(() => {
        resultBox.classList.remove("scale-95", "opacity-0");
    }, 50);

    document.getElementById("total-footprint").textContent = totalCalculated.toFixed(2);

    // Evaluate feedback message states
    const statusText = document.getElementById("footprint-status");
    if(totalCalculated <= 2.5) {
        statusText.textContent = "Excellent. You are approaching sustainable climate targets.";
        statusText.className = "text-xs font-semibold text-emerald-800";
    } else if(totalCalculated <= 5.0) {
        statusText.textContent = "Moderate. Small changes will bring you inside global goals.";
        statusText.className = "text-xs font-semibold text-amber-800";
    } else {
        statusText.textContent = "High Footprint. Review actionable steps in the Reduce window.";
        statusText.className = "text-xs font-semibold text-red-800";
    }

    // Trigger Dynamic Recommendation Engine changes 
    generateInsights(transportKm, meatMeals, energyKwh);
});

// --- REDUCE INSIGHT ENGINE ---
function generateInsights(transport, diet, energy) {
    const deck = document.getElementById("insights-container");
    deck.innerHTML = ""; // Wipe past default view containers

    let insightCards = [];

    if(transport > 80) {
        insightCards.push({
            icon: "bus",
            title: "Optimize Weekly Commuting",
            desc: `Your ${transport}km weekly travel is a heavy emission source. Shifting just 2 days to public transit or carpooling can mitigate up to 400kg of carbon annually.`
        });
    }

    if(diet > 4) {
        insightCards.push({
            icon: "leaf",
            title: "Implement Meatless Mondays",
            desc: `Swapping ${diet} meat-centric food intervals down to plant-based choices reduces your lifestyle agricultural footprint impact metric substantially.`
        });
    }

    if(energy > 120) {
        insightCards.push({
            icon: "plug-zap",
            title: "Kill Vampire Power Drain",
            desc: `With consumption hovering near ${energy} kWh, utilizing smart strips or unplugging desktop computing arrays overnight saves roughly 8% of energy overheads.`
        });
    }

    // Always append one basic global card option
    insightCards.push({
        icon: "package",
        title: "Conscious Consumer Selection",
        desc: "Opt for localized packaging items and zero waste essentials to systematically cut delivery chain emissions."
    });

    // Render components structurally onto the deck
    insightCards.forEach(card => {
        const div = document.createElement("div");
        div.className = "bg-[#F4F7F3] p-4 rounded-2xl border border-[#E4ECE3] flex gap-4 items-start";
        div.innerHTML = `
            <div class="bg-[#3D5A3C] p-2 rounded-xl text-white mt-1">
                <i data-lucide="${card.icon}" class="w-5 h-5"></i>
            </div>
            <div>
                <h4 class="font-semibold text-sm">${card.title}</h4>
                <p class="text-xs text-[#627261] mt-1">${card.desc}</p>
            </div>
        `;
        deck.appendChild(div);
    });

    // Re-initialize dynamic SVG symbols inside newly populated structures
    lucide.createIcons();
}