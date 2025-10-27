
// ============================================
// QR POINTS SYSTEM - FINAL VERSION
// Token for security, Code for readability
// ============================================

function doGet(e) {
    Logger.log('doGet called with: ' + JSON.stringify(e.parameter));

    const action = e.parameter.action;

    // Handle redemption
    if (action === 'redeem') {
        return processRedemption(e);
    }

    // Handle customer portal
    if (action === 'portal') {
        return showCustomerPortal();
    }

    // Handle customer dashboard
    if (action === 'dashboard') {
        const phone = e.parameter.phone || '';
        return showCustomerDashboard(phone);
    }

    // Support both token (new) and code (old)
    const token = e.parameter.token || '';
    const code = e.parameter.code || '';

    return showRedemptionForm(token, code);
}

// ============================================
// SHOW REDEMPTION FORM
// ============================================
function showRedemptionForm(token, code) {
    const webAppUrl = ScriptApp.getService().getUrl();

    // If token provided, look up the product code to display
    var displayCode = code;
    var paramType = 'code';
    var paramValue = code;

    if (token) {
        try {
            const ss = SpreadsheetApp.getActiveSpreadsheet();
            const productSheet = ss.getSheetByName('ProductMaster');
            const productData = productSheet.getDataRange().getValues();

            for (let i = 1; i < productData.length; i++) {
                const rowToken = productData[i][6] ? productData[i][6].toString().trim() : '';
                if (rowToken === token) {
                    displayCode = productData[i][2]; // UniqueCode from column C
                    break;
                }
            }
        } catch (e) {
            Logger.log('Error looking up token: ' + e);
        }
        paramType = 'token';
        paramValue = token;
    }

    var html = '<!DOCTYPE html><html><head>';
    html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    html += '<style>';
    html += '* { margin:0; padding:0; box-sizing:border-box; }';
    html += 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }';
    html += '.card { background: white; border-radius: 20px; padding: 40px; max-width: 400px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }';
    html += 'h1 { text-align: center; color: #667eea; margin-bottom: 10px; font-size: 28px; }';
    html += '.subtitle { text-align: center; color: #888; margin-bottom: 30px; font-size: 14px; }';
    html += '.form-group { margin-bottom: 20px; }';
    html += 'label { display: block; margin-bottom: 8px; color: #333; font-weight: 500; font-size: 14px; }';
    html += 'input { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 16px; }';
    html += 'input:focus { outline: none; border-color: #667eea; }';
    html += 'input:read-only { background: #f5f5f5; color: #666; }';
    html += '.btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; }';
    html += '.btn:disabled { opacity: 0.6; }';
    html += '.alert { margin-top: 20px; padding: 15px; border-radius: 10px; display: none; text-align: center; }';
    html += '.alert.show { display: block; }';
    html += '.alert.success { background: #d4edda; color: #155724; }';
    html += '.alert.error { background: #f8d7da; color: #721c24; }';
    html += '.loading { text-align: center; color: #667eea; display: none; margin-top: 15px; }';
    html += '.loading.show { display: block; }';
    html += '</style></head><body>';
    html += '<div class="card">';
    html += '<h1>🎁 Points Redemption</h1>';
    html += '<p class="subtitle">Fill details to earn points</p>';
    html += '<div class="form-group"><label>Product Code</label>';
    html += '<input type="text" id="codeDisplay" value="' + (displayCode || '') + '" readonly></div>';
    html += '<div class="form-group"><label>Your Name *</label>';
    html += '<input type="text" id="nameInput" placeholder="Enter your full name"></div>';
    html += '<div class="form-group"><label>Phone Number *</label>';
    html += '<input type="tel" id="phoneInput" placeholder="10-digit mobile number" maxlength="10"></div>';
    html += '<button class="btn" id="submitBtn" onclick="submit()">Redeem Points</button>';
    html += '<div class="loading" id="loading">⏳ Processing...</div>';
    html += '<div class="alert" id="alert"></div></div>';
    html += '<script>';
    html += 'var webAppUrl="' + webAppUrl + '";';
    html += 'var paramType="' + paramType + '";';
    html += 'var paramValue="' + paramValue + '";';
    html += 'document.getElementById("phoneInput").addEventListener("input",function(e){this.value=this.value.replace(/\\D/g,"").slice(0,10);});';
    html += 'function submit(){';
    html += 'var name=document.getElementById("nameInput").value.trim();';
    html += 'var phone=document.getElementById("phoneInput").value.trim();';
    html += 'if(!paramValue){showAlert("Please scan a valid QR code","error");return;}';
    html += 'if(!name){showAlert("Please enter your name","error");return;}';
    html += 'if(phone.length!==10){showAlert("Please enter valid 10-digit phone number","error");return;}';
    html += 'document.getElementById("submitBtn").disabled=true;';
    html += 'document.getElementById("loading").classList.add("show");';
    html += 'document.getElementById("alert").classList.remove("show");';
    html += 'var url=webAppUrl+"?action=redeem&"+paramType+"="+encodeURIComponent(paramValue)+"&name="+encodeURIComponent(name)+"&phone="+encodeURIComponent(phone);';
    html += 'fetch(url).then(function(res){return res.text();}).then(function(text){';
    html += 'try{var data=JSON.parse(text);';
    html += 'document.getElementById("loading").classList.remove("show");';
    html += 'document.getElementById("submitBtn").disabled=false;';
    html += 'if(data.success){';
    html += 'var msg="✅ "+data.message;';
    html += 'if(data.data&&data.data.totalPoints){msg+="<br><br><a href=\\""+webAppUrl+"?action=dashboard&phone="+encodeURIComponent(phone)+"\\" style=\\"color:#667eea;font-weight:600;text-decoration:none;\\">View My Dashboard →</a>";}';
    html += 'showAlert(msg,"success");';
    html += 'document.getElementById("nameInput").value="";';
    html += 'document.getElementById("phoneInput").value="";';
    html += '}else{showAlert("❌ "+data.message,"error");}}';
    html += 'catch(err){document.getElementById("loading").classList.remove("show");';
    html += 'document.getElementById("submitBtn").disabled=false;';
    html += 'showAlert("❌ Server error","error");}';
    html += '}).catch(function(err){document.getElementById("loading").classList.remove("show");';
    html += 'document.getElementById("submitBtn").disabled=false;';
    html += 'showAlert("❌ Network error","error");});}';
    html += 'function showAlert(msg,type){var alert=document.getElementById("alert");alert.innerHTML=msg;alert.className="alert "+type+" show";}';
    html += 'document.addEventListener("keypress",function(e){if(e.key==="Enter")submit();});';
    html += '</script></body></html>';

    return HtmlService.createHtmlOutput(html)
        .setTitle('Points Redemption')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ============================================
// PROCESS REDEMPTION
// ============================================
function processRedemption(e) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const productSheet = ss.getSheetByName('ProductMaster');
        const usedSheet = ss.getSheetByName('UsedQRs');
        const customerSheet = ss.getSheetByName('CustomerPoints');
        const auditSheet = ss.getSheetByName('AuditLog');

        if (!productSheet || !usedSheet || !customerSheet || !auditSheet) {
            return jsonResponse(false, 'Sheet configuration error');
        }

        const token = (e.parameter.token || '').toString().trim();
        const code = (e.parameter.code || '').toString().trim().toUpperCase();
        const name = (e.parameter.name || '').toString().trim();
        const phone = (e.parameter.phone || '').toString().trim();

        if (!token && !code) return jsonResponse(false, 'Product code required');
        if (!name) return jsonResponse(false, 'Name required');
        if (!phone || phone.length !== 10) return jsonResponse(false, 'Valid phone number required');

        // Find product
        const productData = productSheet.getDataRange().getValues();
        let product = null;

        for (let i = 1; i < productData.length; i++) {
            const row = productData[i];
            const rowCode = row[2].toString().trim().toUpperCase();
            const rowToken = row[6] ? row[6].toString().trim() : '';

            if ((token && rowToken === token) || (!token && rowCode === code)) {
                product = {
                    category: row[0],
                    productName: row[1],
                    code: row[2],        // THIS is the readable code we'll log
                    points: row[3],
                    token: rowToken
                };
                break;
            }
        }

        if (!product) {
            // Log with code if available, otherwise 'UNKNOWN'
            auditSheet.appendRow([new Date(), code || 'UNKNOWN', phone, 'Invalid', 0]);
            return jsonResponse(false, 'Invalid product code');
        }

        // Check if already used
        const usedData = usedSheet.getDataRange().getValues();
        for (let i = 1; i < usedData.length; i++) {
            const usedCode = usedData[i][0].toString().trim().toUpperCase();
            const usedToken = usedData[i][7] ? usedData[i][7].toString().trim() : '';

            if ((token && usedToken === token) || (product.code && usedCode === product.code)) {
                // Log duplicate with product.code (not token)
                auditSheet.appendRow([new Date(), product.code, phone, 'Duplicate', product.points]);
                return jsonResponse(false, 'This code has already been redeemed');
            }
        }

        // Add to UsedQRs
        usedSheet.appendRow([
            product.code,
            product.productName,
            product.category,
            product.points,
            name,
            phone,
            new Date(),
            product.token || ''
        ]);

        // Update CustomerPoints
        const customerData = customerSheet.getDataRange().getValues();
        let totalPoints = Number(product.points);
        let customerFound = false;

        for (let i = 1; i < customerData.length; i++) {
            if (customerData[i][0].toString().trim() === phone) {
                totalPoints = Number(customerData[i][2]) + Number(product.points);
                customerSheet.getRange(i + 1, 2).setValue(name);
                customerSheet.getRange(i + 1, 3).setValue(totalPoints);
                customerFound = true;
                break;
            }
        }

        if (!customerFound) {
            customerSheet.appendRow([phone, name, product.points]);
        }

        // CRITICAL: Log to audit with product.code (NOT token)
        Logger.log('===== AUDIT LOG ENTRY =====');
        Logger.log('Logging code: ' + product.code);
        Logger.log('Phone: ' + phone);
        Logger.log('Points: ' + product.points);
        auditSheet.appendRow([new Date(), product.code, phone, 'Success', product.points]);
        Logger.log('===== AUDIT LOGGED =====');

        return jsonResponse(true, `${product.points} points added! Total: ${totalPoints}`, {
            code: product.code,
            product: product.productName,
            category: product.category,
            points: product.points,
            totalPoints: totalPoints
        });

    } catch (error) {
        Logger.log('ERROR: ' + error.toString());
        return jsonResponse(false, 'Server error: ' + error.message);
    }
}

function jsonResponse(success, message, data) {
    const response = { success: success, message: message };
    if (data) response.data = data;
    return ContentService.createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
}

// Token generation function
function generateTokensForProducts() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('ProductMaster');
    if (!sheet) return;

    const lastRow = sheet.getLastRow();
    let count = 0;

    for (let i = 2; i <= lastRow; i++) {
        const uniqueCode = sheet.getRange(i, 3).getValue();
        const existingToken = sheet.getRange(i, 7).getValue();

        if (uniqueCode && !existingToken) {
            const token = generateRandomToken(16);
            sheet.getRange(i, 7).setValue(token);
            count++;
        }
    }

    SpreadsheetApp.getUi().alert('Generated ' + count + ' tokens');
}

function generateRandomToken(length) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}