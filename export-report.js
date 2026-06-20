/**
 * @file export-report.js
 * @description Generates and downloads a CSV report of the user's carbon footprint progress.
 */

/**
 * Calculates summary statistics for the user's carbon wallet and shifts.
 * @returns {Object} The summary statistics.
 */
function generateSummaryStats() {
    try {
        const S = window.SecurityUtils;
        const walletDataRaw = S ? S.safeLocalStorageGet('carbon_wallet') : JSON.parse(localStorage.getItem('carbon_wallet'));
        const walletData = walletDataRaw || {};
        
        const shiftsRaw = S ? S.safeLocalStorageGet('carbon_completed_shifts') : JSON.parse(localStorage.getItem('carbon_completed_shifts'));
        const shifts = shiftsRaw || [];

        const totalPoints = walletData.points || 0;
        let totalCO2 = 0;
        const categories = {};

        shifts.forEach(shift => {
            totalCO2 += (shift.co2_saved || 0);
            const cat = shift.category || 'General';
            categories[cat] = (categories[cat] || 0) + 1;
        });

        let mostActiveCategory = 'None';
        let maxCount = 0;
        for (const [cat, count] of Object.entries(categories)) {
            if (count > maxCount) {
                maxCount = count;
                mostActiveCategory = cat;
            }
        }

        return {
            totalPoints,
            totalCO2Saved: totalCO2.toFixed(2),
            mostActiveCategory,
            currentStreak: walletData.streak || 0
        };
    } catch (error) {
        console.error("Error generating summary stats:", error);
        return { totalPoints: 0, totalCO2Saved: 0, mostActiveCategory: 'Error', currentStreak: 0 };
    }
}

/**
 * Reads local storage data and triggers a CSV download of the user's carbon report.
 */
function generateCSVReport() {
    try {
        const S = window.SecurityUtils;
        const shiftsRaw = S ? S.safeLocalStorageGet('carbon_completed_shifts') : JSON.parse(localStorage.getItem('carbon_completed_shifts'));
        const shifts = shiftsRaw || [];

        if (shifts.length === 0) {
            showSuccessToast("No completed shifts found to export. ⚠️");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Action,Category,Points Earned,CO2 Saved (kg)\n";

        shifts.forEach(shift => {
            const date = shift.date || new Date().toISOString().split('T')[0];
            const action = `"${(shift.name || 'Unknown Action').replace(/"/g, '""')}"`;
            const category = `"${(shift.category || 'General').replace(/"/g, '""')}"`;
            const points = shift.points || 0;
            const co2 = shift.co2_saved || 0;
            csvContent += `${date},${action},${category},${points},${co2}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "carbon-report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showSuccessToast("Report downloaded successfully! 🌱");
    } catch (error) {
        console.error("Error generating CSV:", error);
        showSuccessToast("Failed to generate report. ❌");
    }
}

/**
 * Displays a temporary success toast notification.
 * @param {string} message - The message to display.
 */
function showSuccessToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'var(--accent-emerald)';
    toast.style.color = '#fff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.zIndex = '9999';
    toast.style.fontFamily = 'var(--font-sans)';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
}
