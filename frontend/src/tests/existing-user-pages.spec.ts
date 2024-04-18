import { test, expect } from '@playwright/test';
import {Token} from "../utils/ApiInterfaces.ts";
// import loginLoader, {loginLoaderObject} from "../dataloaders/LoginLoader.ts";
// import useAuth from "../hooks/useAuth.ts";

test('fake login works', async ({ page }) => {
    await page.goto('https://localhost:8080');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Delphi/);
    // const {setUser} = useAuth();
    const url = 'http://127.0.0.1:8000/api/fake-login?uid=6'  //uid=6 is Robbe
    const token = await (await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}}))
        .json() as Token
    if (token.token) {
        // localStorage.setItem('token', token.token)

        // Set an item in localStorage
        console.log(token.token); // Should log 'your_token_value'
        console.log(typeof token.token); // Should log 'string'
        // await page.evaluate(() => {
        //     localStorage.setItem('token', <string>token.token);
        // });
        await page.evaluate((tokenValue) => {
            localStorage.setItem('token', tokenValue);
        }, token.token); // Pass the token value as an argument

        // Verify the item was set correctly
        const tokenValue = await page.evaluate(() => localStorage.getItem('token'));
        console.log(tokenValue); // Should log 'your_token_value'

        // const result: loginLoaderObject = await loginLoader()
        // if (result.user) {
        //     setUser(result.user)
        // } else {
        //     localStorage.removeItem('token')
        //     setUser(undefined)
        // }
    }

    await page.goto('https://localhost:8080');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Delphi/);
    const username = page.getByRole('button', { name: 'Robbe' })
    await expect(username).toBeVisible();
    const home = page.getByText('Flash Cards').first();
    await expect(home).toBeVisible();
});