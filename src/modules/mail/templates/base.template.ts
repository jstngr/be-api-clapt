export const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Reset styles */
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9fafb;
        }
        
        /* Container */
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        
        /* Header */
        .header {
            text-align: center;
            padding: 20px 0;
            background-color: #f8fafc;
            border-radius: 8px 8px 0 0;
        }
        
        .logo {
            width: 120px;
            height: auto;
        }
        
        /* Content */
        .content {
            padding: 32px 24px;
            background-color: #ffffff;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        /* Button */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #3b82f6;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin: 24px 0;
            text-align: center;
        }
        
        .button:hover {
            background-color: #2563eb;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            padding: 24px;
            color: #6b7280;
            font-size: 14px;
        }
        
        /* Responsive */
        @media screen and (max-width: 600px) {
            .container {
                width: 100%;
                padding: 10px;
            }
            
            .content {
                padding: 20px 16px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{logoUrl}}" alt="Saas Logo" class="logo">
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Saas. All rights reserved.</p>
            <p>If you didn't request this email, please ignore it or <a href="{{supportUrl}}">contact support</a>.</p>
        </div>
    </div>
</body>
</html>
`;
