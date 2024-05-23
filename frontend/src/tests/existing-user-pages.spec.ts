import { test, expect } from '@playwright/test';
import {Token} from "../utils/ApiInterfaces.ts";

//use fake login endpoint from DEBUG mode backend
async function login(page, uid) {
    await page.goto('https://localhost:8080');
    await page.waitForLoadState('networkidle');
    const url = "http://127.0.0.1:8000/api/fake-login?uid="+uid.toString();
    const token = await (await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}}))
        .json() as Token
    if (token.token) {
        await page.evaluate((tokenValue) => {
            localStorage.setItem('token', tokenValue);
        }, token.token); // geef token value mee als argument
        const tokenValue = await page.evaluate(() => localStorage.getItem('token'));
        expect(tokenValue).toBe(token.token);
    }
    await page.goto('https://localhost:8080');
    await page.waitForLoadState('networkidle');
}

test('user flow: student', async ({ page }) => {
    await login(page, 6);  //uid=6 is Robbe
    await expect(page).toHaveTitle(/Delphi/);
    const username = page.getByRole('button', { name: 'Robbe' })
    await expect(username).toBeVisible();
    // ga naar student home
    const settingsButton = page.locator('.is-transparent.mb-5');  // geen naam dus zoekt css class
    await settingsButton.click();
    const studentButton = page.getByRole('link', { name: 'student' })
    await expect(studentButton).toBeVisible();
    await studentButton.click();
    const home = page.getByText('Flash Cards').first();
    await expect(home).toBeVisible();
    //ga naar projects
    const projectsButton = page.getByRole('link').nth(1);
    await projectsButton.click();
    const projectsTitle = page.getByText('Projects');
    await expect(projectsTitle).toBeVisible();
    //klik op flashcards
    const flashcardsButton = page.getByRole('link', { name: 'Flash Cards' })
    await flashcardsButton.click();
    const groupMember = page.getByText('robbe.vandekeere@ugent.be');
    await expect(groupMember).toBeVisible();
    const submissionReq = page.getByText('submission.zip');
    await expect(submissionReq).toBeVisible();
    const leaveButton = page.getByRole('button').nth(2);
    await expect(leaveButton).toBeVisible();
    await leaveButton.click();
    await expect(groupMember).toBeHidden();
    //selecteer groep
    const joinButton = page.getByRole('row', { name: '2 2' }).getByRole('button');
    await expect(joinButton).toBeVisible();
    await joinButton.click();
    await expect(groupMember).toBeVisible();
    const otherMember = page.getByRole('cell', { name: 'Ruben', exact: true });
    await expect(otherMember).toBeVisible();
    await expect(joinButton).toBeHidden();
    //ga naar courses
    const coursesButton = page.getByRole('link').nth(2);
    await coursesButton.click();
    const algdata = page.getByRole('link', { name: 'Algoritmen en Datastructuren' })
    await algdata.click();
    const teacherName = page.getByText('Sophie Devolder');
    await expect(teacherName).toBeVisible();
    const projectLink = page.getByRole('link', { name: 'Sorteer Algoritmen Implementatie' })
    await projectLink.click();
    const description = page.getByText('Implementeer verschillende sorteeralgoritmen');
    await expect(description).toBeVisible();
    //ga naar settings en log uit
    await settingsButton.click();
    const logoutButton = page.locator('div').filter({ hasText: /^Logout:$/ }).getByRole('link')
    await logoutButton.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Delphi/);
    const loginButton = page.getByRole('link', { name: 'Log in' })
    await expect(loginButton).toBeVisible();
});

test('user flow: teacher', async ({ page }) => {
    await login(page, 11);  //uid=11 is PJ
    await expect(page).toHaveTitle(/Delphi/);
    const username = page.getByRole('button', { name: 'Pieter-Jan De Smet' })
    await expect(username).toBeVisible();
    const home = page.getByText('Flash Cards').first();
    await expect(home).toBeVisible();

    const projectsButton = page.getByRole('link').nth(1);
    await projectsButton.click();
    const projectsTitle = page.getByText('Projects');
    await expect(projectsTitle).toBeVisible();
    const project1 = page.getByRole('link', { name: 'Flash Cards' });
    await project1.click();
    const stats = page.getByText('Statistics');
    await expect(stats).toBeVisible();
    await stats.click();
    const statsNum = page.getByText('Success: 100 %');
    await expect(statsNum).toBeVisible();
    const close = page.getByLabel('close');
    await close.click();

    await projectsButton.click();
    await expect(projectsTitle).toBeVisible();
    const newProjectButton = page.getByRole('link', { name: 'new project' });
    await newProjectButton.click();
    const newProjectTitle = page.getByText('Create project');
    await expect(newProjectTitle).toBeVisible();
    const nameInput = page.getByPlaceholder('Enter a name');
    await nameInput.fill('Test Project');
    const hours = page.getByRole('combobox').nth(1);
    await hours.selectOption({ label: '16' });
    const minutes = page.getByRole('combobox').nth(2);
    await minutes.selectOption({ label: '20' });
    const description = page.getByPlaceholder('Optional description of the');
    await description.fill('test 1 2 3 test');
    const visible = page.locator('.field-body > div > .react-switch-handle').first();
    await visible.click();
    const saveButton = page.getByRole('button', { name: 'Save' });
    await saveButton.click();

    await projectsButton.click();
    const newProject = page.getByRole('link', { name: 'Test Project' });
    await newProject.click();
    const projectTitle = page.getByText('Test Project');
    await expect(projectTitle).toBeVisible();

    const coursesButton = page.getByRole('link').nth(2);
    await coursesButton.click();
    const objprog = page.getByRole('link', { name: 'Objectgericht Programmeren' })
    await objprog.click();
    const teacherName = page.getByText('Kris Coolsaet');
    await expect(teacherName).toBeVisible();

    //ga naar settings en log uit
    const settingsButton = page.locator('.is-transparent.mb-5');
    await settingsButton.click();
    const logoutButton = page.locator('div').filter({ hasText: /^Logout:$/ }).getByRole('link')
    await logoutButton.click();
    await page.waitForLoadState('networkidle');
    const loginButton = page.getByRole('link', { name: 'Log in' })
    await expect(loginButton).toBeVisible();
});