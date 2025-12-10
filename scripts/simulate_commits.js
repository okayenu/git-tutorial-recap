import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import puppeteer from 'puppeteer';

const SCHEDULE_PATH = path.resolve('Character_Customization_Schedule.md');
const SCREENSHOT_DIR = path.resolve('Screenshots');

function parseSchedule() {
  const content = fs.readFileSync(SCHEDULE_PATH, 'utf-8');
  const lines = content.split('\n');
  const tasks = [];
  
  let currentDateStr = '';
  
  for (const line of lines) {
    if (line.startsWith('### ')) {
      // e.g. ### Monday, August 25, 2025
      currentDateStr = line.replace('### ', '').trim();
    } else if (line.startsWith('- **') && currentDateStr) {
      // e.g. - **12:55 PM**: Design JSON schema for character presets
      const match = line.match(/- \*\*([^:]+:[^:]+ [A-Z]{2})\*\*: (.*)/);
      if (match) {
        const timeStr = match[1];
        const taskDesc = match[2];
        
        // Parse "Monday, August 25, 2025" and "12:55 PM" into a Date object
        const fullDateStr = `${currentDateStr} ${timeStr}`;
        const dateObj = new Date(fullDateStr);
        
        tasks.push({
          dateObj,
          dateStr: fullDateStr,
          description: taskDesc,
          weekNum: getWeekNumber(dateObj)
        });
      }
    }
  }
  
  // Sort tasks chronologically just in case
  const sortedTasks = tasks.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  // Filter for Batch 3 (Dec)
  return sortedTasks.filter(task => task.dateObj >= new Date('2025-12-01'));
}

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}

async function takeScreenshot(browser, dateObj, label, weekNum) {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Switch to Settings to reveal Gender buttons
    await page.evaluate(() => {
      const settingsBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Settings'));
      if (settingsBtn) settingsBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));
    
    // Click Male
    await page.evaluate(() => {
      const maleBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Male');
      if (maleBtn) maleBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000)); // Wait for 3D model to load
    
    // Switch to target tab
    await page.evaluate((week) => {
      const tabs = ['Face', 'Body', 'Skin/Hair', 'Settings'];
      const targetTab = tabs[week % 4];
      const targetBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes(targetTab));
      if (targetBtn) targetBtn.click();
    }, weekNum || 0);
    await new Promise(r => setTimeout(r, 500));

    // Inject a timestamp overlay
    const timestampStr = dateObj.toLocaleString();
    await page.evaluate((ts) => {
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.bottom = '20px';
      overlay.style.right = '20px';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
      overlay.style.color = 'white';
      overlay.style.padding = '10px 20px';
      overlay.style.borderRadius = '5px';
      overlay.style.fontSize = '24px';
      overlay.style.fontWeight = 'bold';
      overlay.style.zIndex = '9999';
      overlay.innerText = ts;
      document.body.appendChild(overlay);
    }, timestampStr);

    // Give it a moment to render
    await new Promise(r => setTimeout(r, 1000));
    
    const safeDate = timestampStr.replace(/[:/,]/g, '-').replace(/ /g, '_');
    const filepath = path.join(SCREENSHOT_DIR, `screenshot_${safeDate}_Male.png`);
    
    await page.screenshot({ path: filepath });
    console.log(`Screenshot saved: ${filepath}`);
  } catch (err) {
    console.error(`Failed to take screenshot for ${label}:`, err.message);
  } finally {
    await page.close();
  }
}

async function runSimulation() {
  const tasks = parseSchedule();
  if (tasks.length === 0) {
    console.log('No tasks found in schedule.');
    return;
  }
  console.log(`Found ${tasks.length} tasks.`);

  const dummyFile = path.resolve('progress.log');

  // Launch Puppeteer for screenshots
  console.log('Launching browser for screenshots... (Make sure dev server is running on port 3000)');
  let browser;
  try {
    browser = await puppeteer.launch();
  } catch (err) {
    console.log('Puppeteer launch failed. Proceeding without screenshots.');
  }

  let lastWeek = -1;

  for (const task of tasks) {
    console.log(`Processing Task: [${task.dateStr}] ${task.description}`);

    // Create an incremental change
    const logEntry = `[${task.dateStr}] Completed: ${task.description}\n`;
    fs.appendFileSync(dummyFile, logEntry);

    // Commit the change
    try {
      execSync(`git add "${dummyFile}"`);
      
      const commitDate = task.dateObj.toISOString();
      const env = {
        ...process.env,
        GIT_AUTHOR_DATE: commitDate,
        GIT_COMMITTER_DATE: commitDate
      };
      
      execSync(`git commit -m "${task.description}"`, { env, stdio: 'pipe' });
    } catch (err) {
      console.error(`Git commit failed for task: ${task.description}`);
      console.error(err.message);
    }

    // Take screenshot if it's a new week
    if (browser && task.weekNum !== lastWeek) {
      lastWeek = task.weekNum;
      console.log(`New week detected (Week ${task.weekNum}). Taking weekly screenshot...`);
      await takeScreenshot(browser, task.dateObj, `Week ${task.weekNum}`, task.weekNum);
    }
  }

  if (browser) {
    await browser.close();
  }
  console.log('Simulation complete!');
}

runSimulation().catch(console.error);
