const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

/**
 * Generate summary image with country statistics
 */
async function generateSummaryImage(totalCountries, topCountries, lastRefreshed) {
  try {
    // Create canvas
    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Country Statistics Summary', width / 2, 60);

    // Total countries
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Total Countries: ${totalCountries}`, width / 2, 120);

    // Line separator
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 150);
    ctx.lineTo(width - 50, 150);
    ctx.stroke();

    // Top 5 countries header
    ctx.font = 'bold 28px Arial';
    ctx.fillText('Top 5 Countries by GDP', width / 2, 200);

    // Top 5 countries list
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    let yPosition = 250;

    topCountries.forEach((country, index) => {
      const gdpFormatted = formatGDP(country.estimated_gdp);
      const text = `${index + 1}. ${country.name} - $${gdpFormatted}`;
      
      // Background for each item
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(50, yPosition - 25, width - 100, 40);
      
      // Text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, 70, yPosition);
      yPosition += 60;
    });

    // Timestamp
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e5e7eb';
    const timestamp = new Date(lastRefreshed).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
    ctx.fillText(`Last Refreshed: ${timestamp}`, width / 2, height - 30);

    // Ensure cache directory exists
    const cacheDir = path.join(process.cwd(), 'cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Save image
    const imagePath = path.join(cacheDir, 'summary.png');
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(imagePath, buffer);

    console.log(`✅ Summary image generated at: ${imagePath}`);
    return imagePath;
  } catch (error) {
    console.error('Error generating summary image:', error.message);
    throw error;
  }
}

/**
 * Format GDP with appropriate units
 */
function formatGDP(gdp) {
  if (gdp >= 1e12) {
    return (gdp / 1e12).toFixed(2) + 'T';
  } else if (gdp >= 1e9) {
    return (gdp / 1e9).toFixed(2) + 'B';
  } else if (gdp >= 1e6) {
    return (gdp / 1e6).toFixed(2) + 'M';
  } else {
    return gdp.toFixed(2);
  }
}

module.exports = {
  generateSummaryImage
};
