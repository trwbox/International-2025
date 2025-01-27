
<?php
session_start();

$message = '';
$link = '';
$file_size = 0;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $target_dir = "/var/www/html/uploads/";

    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    if (isset($_FILES["fileToUpload"])) {
        // TODO: I think this allows for path traversal with an input like "../../filename" potentially allowing overwriting itself
        $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);

        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
            $message = "The file " . basename($_FILES["fileToUpload"]["name"]) . " has been uploaded.";
            $link = "<a href='/uploads/" . htmlspecialchars(basename($_FILES["fileToUpload"]["name"])) . "' class='view-link' target='_blank'>View it here</a>";
            $file_size = filesize($target_file);
            $_SESSION['file_uploaded'] = true;
            $_SESSION['uploaded_file'] = basename($_FILES["fileToUpload"]["name"]);
        } else {
            $message = "Sorry, there was an error uploading your file.";
        }
    } else {
        $message = "No file was uploaded.";
    }

    if (isset($_POST['creationName'])) {
        $_SESSION['creationName'] = $_POST['creationName'];
    }
}

$creationName = isset($_SESSION['creationName']) ? $_SESSION['creationName'] : '';
$uploadedFile = isset($_SESSION['uploaded_file']) ? $_SESSION['uploaded_file'] : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Printing Portal</title>
    <style>
        body, html {
            height: 100%;
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #001f3f;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            max-width: 500px;
            padding: 20px;
        }
        .portal {
            background-color: #003366;
            border-radius: 50%;
            width: 300px;
            height: 300px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 50px #0066cc;
            position: relative;
            overflow: hidden;
            margin: 40px 0;
        }
        .portal::before {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background-image: conic-gradient(
                transparent, 
                transparent, 
                transparent, 
                #0066cc
            );
            animation: rotate 4s linear infinite;
        }
        .portal::after {
            content: "";
            position: absolute;
            inset: 5px;
            background: #003366;
            border-radius: 50%;
            z-index: 1;
        }
        @keyframes rotate {
            100% {
                transform: rotate(1turn);
            }
        }
        .content {
            z-index: 2;
            text-align: center;
        }
        .btn {
            background-color: #0066cc;
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.3s;
        }
        .btn:hover {
            background-color: #0055aa;
        }
        .upload-btn {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 10px;
        }
        .upload-btn:hover {
            transform: scale(1.05);
        }
        #continueBtn {
            width: 200px;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 18px;
            margin-top: 20px;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.5s, transform 0.5s;
        }
        #continueBtn.visible {
            opacity: 1;
            transform: translateY(0);
        }
        .upload-icon {
            font-size: 48px;
            color: #0066cc;
            margin-bottom: 20px;
        }
        #message {
            color: white;
            margin-top: 10px;
            text-align: center;
        }
        #creationName {
            width: 100%;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 25px;
            border: 2px solid #0066cc;
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 16px;
            text-align: center;
            transition: all 0.3s ease;
        }
        #creationName:focus {
            outline: none;
            box-shadow: 0 0 15px #0066cc;
            background-color: rgba(255, 255, 255, 0.2);
        }
        #creationName::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }
        .view-link {
            color: #0066cc;
            text-decoration: none;
        }
        .view-link:hover {
            text-decoration: underline;
        }
        #uploadForm {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }
        #fileInfo {
            color: white;
            margin-top: 10px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <form id="uploadForm" method="post" enctype="multipart/form-data">
            <input type="text" id="creationName" name="creationName" placeholder="Name your creation" required value="<?php echo htmlspecialchars($creationName); ?>">
            <div class="portal">
                <div class="content">
                    <input type="file" id="fileInput" name="fileToUpload" style="display: none;">
                    <button type="button" class="btn upload-btn" onclick="document.getElementById('fileInput').click()">
                        Upload File
                    </button>
                </div>
            </div>
            <button id="continueBtn" class="btn" type="button">Continue</button>
        </form>
        <div id="message">
            <?php 
                // TODO: Double check that this block doesn't result in stored XSS to steal user cookies
                echo $message;
                echo $link ? "<br>$link" : ''; 
            ?>
        </div>
    </div>
<script>
    window.onload = function() {
        // Reset the file input when the page loads
        const fileInput = document.getElementById('fileInput');
        fileInput.value = ''; // This will clear the selected file

        // Check if the file was uploaded, and if so, show the continue button
        checkInputs();
    };

    function checkInputs() {
        const creationName = document.getElementById('creationName');
        const continueBtn = document.getElementById('continueBtn');
        
        if (<?php echo isset($_SESSION['file_uploaded']) && $_SESSION['file_uploaded'] ? 'true' : 'false'; ?> && creationName.value.trim() !== '') {
            continueBtn.classList.add('visible');
        } else {
            continueBtn.classList.remove('visible');
        }
    }
</script>
    <script>
        const fileInput = document.getElementById('fileInput');
        const creationName = document.getElementById('creationName');
        const continueBtn = document.getElementById('continueBtn');
        const uploadForm = document.getElementById('uploadForm');
        const fileInfo = document.getElementById('fileInfo');

        function checkInputs() {
            if (<?php echo isset($_SESSION['file_uploaded']) && $_SESSION['file_uploaded'] ? 'true' : 'false'; ?> && creationName.value.trim() !== '') {
                continueBtn.classList.add('visible');
            } else {
                continueBtn.classList.remove('visible');
            }
        }

        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                uploadForm.submit();
            }
        });

        creationName.addEventListener('input', checkInputs);

        document.addEventListener('DOMContentLoaded', checkInputs);

        continueBtn.addEventListener('click', function() {
            const orderInfo = {
                creationName: creationName.value,
                fileSize: <?php echo $file_size; ?>,
                fileName: '<?php echo addslashes($uploadedFile); ?>'
            };

            fetch('/api/order-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderInfo),
            })
            .then(response => response.json())
            .then(data => {
                // TODO: This is odd, and I don't really like it. Something seems fishy with how it's calling ot the api page.
                window.location.href = `/payment?orderId=${data.order.guid}`;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    </script>
</body>
</html>

