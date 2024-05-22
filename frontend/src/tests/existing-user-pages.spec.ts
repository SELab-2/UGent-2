import { test, expect } from '@playwright/test';
import {Token} from "../utils/ApiInterfaces.ts";

test('fake login works', async ({ page }) => {
    await page.goto('https://localhost:8080');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Delphi/);
    const url = 'http://127.0.0.1:8000/api/fake-login?uid=6'  //uid=6 is Robbe
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
    const status3 = page.getByRole('link').nth(1)
    await expect(status3).toBeVisible();
    //ga naar projects
    const projectsButton = page.getByRole('link').nth(1);
    await projectsButton.click();
    const projectsTitle = page.getByText('Projects');
    await expect(projectsTitle).toBeVisible();
    //klik op flashcards
    const flashcardsButton = page.getByRole('link', { name: 'Flash Cards' })
    await flashcardsButton.click();
    const confirmButton = page.getByRole('button', { name: 'Confirm' })
    await expect(confirmButton).toBeVisible();
    const groupMember = page.getByText('mathieu.strypsteen@ugent.be');
    await expect(groupMember).toBeVisible();
    const submissionReq = page.getByText('submission.zip');
    await expect(submissionReq).toBeVisible();
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
    await logoutButton.click(); // deze button zou wel iets eenvoudiger mogen zijn
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Delphi/);
    const loginButton = page.getByRole('link', { name: 'Log in' })
    await expect(loginButton).toBeVisible();
});