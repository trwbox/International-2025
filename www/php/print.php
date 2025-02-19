<?php
session_start();

// Log any errors that occur
ini_set('log_errors', TRUE);
// Do not dispaly the errors to the user
ini_set('display_errors', FALSE);
// Enable all the error reporting
ini_set('error_reporting', E_ALL);

// Load the composer autoloader
require __DIR__ . '/vendor/autoload.php';

// Import the necessary classes for STL loading
use PHPSTL\Model\STLModel;
use PHPSTL\Reader\STLReader;
use PHPSTL\Handler\DimensionsHandler;

$message = '';
$link = '';
$file_size = 0;

// Turn all php errors into exceptions
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    // error was suppressed with the @-operator
    if (0 === error_reporting()) {
        return false;
    }
    
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});


function handle_upload() {
    # Make the message and link variables available in the function
    global $message, $link, $file_size;
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // If there is creationName is a not a string longer than 0 characters, return
        if (!isset($_POST['creationName']) || strlen($_POST['creationName']) === 0) {
            $message = "ERROR: Please put in a name for your creation before pressing upload.";
            return;
        }

        # Get the target_dir from the environment variable
        $target_dir = getenv('UPLOAD_DIR');

        # Check if the target_dir exists, if not create it        
        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }
    
        # Check if the file was uploaded
        if (isset($_FILES["fileToUpload"])) {
            // TODO: The basename function should be enough to sanitize the file name, but it's worth double checking
            $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);

            # Get the real path of the target file after link resolution
            $intended_target = realpath($target_file);
            if($intended_target !== false){
                // The file already exists
                $message = "Sorry, file already exists.";
                return;
            }

            // Get the real path of the target directory after link resolution
            $intended_target_dir = realpath(dirname($target_file));
            # Add the trailing slash to the intended target directory
            $intended_target_dir = $intended_target_dir . '/';
            // Roughly check based on this answer
            // https://stackoverflow.com/questions/4205141/preventing-directory-traversal-in-php-but-allowing-paths
            if(strpos($intended_target_dir, $target_dir) !== 0) {
                # Log the ip address of the user who tried to upload a file with a path traversal attack convert the strpos value to a string
                error_log("Invalid target file: " . $target_file . " for: " . $target_dir);
                // TODO: Don't var_dump here
                var_dump($strpos_value);
                $message = 'Error uploading file';
                // http_response_code(423);
                return;
            }

            // Attempt to load the project as an STL file
            try {
                $reader = STLReader::forFile($_FILES["fileToUpload"]["tmp_name"]);
            } catch (Exception $e) {
                $message = "Invalid file format. Please upload an STL file.";
                return;
            }
            if ($reader === null) {
                $message = "Invalid file format. Please upload an STL file.";
                return;
            }

            $reader->setHandler(new DimensionsHandler());
            try {
                $dimensions = $reader->readModel();
            } catch (Exception $e) {
                $message = "Invalid file format. Please upload an STL file.";
                return;
            }
            $dimensions = $reader->readModel();
            if ($dimensions === null) {
                $message = "Invalid file format. Please upload an STL file.";
                return;
            }

            // Make the request to the Next.js app to create the order and get the order ID
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'http://192.168.1.101:3000/api/order-info');
            curl_setopt($ch, CURLOPT_POST, 1);
            
            $orderInfo = array(
                'creationName' => $_POST['creationName'],
                'fileSize' => filesize($_FILES["fileToUpload"]["tmp_name"]),
                'fileName' => basename($_FILES["fileToUpload"]["name"]),
            );

            // TODO: Don't var_dump here
            var_dump(json_encode($orderInfo));
            // Set the request body to the order info
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderInfo));
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            
            $server_output = curl_exec($ch);
            curl_close($ch);

            $response = json_decode($server_output, true);
            if ($response === null) {
                $message = "Error creating order first.";
                return;
            }

            // TODO: Don't var_dump here
            var_dump($response);
            // Get the order ID from the ['order']['guid'] key in the response if it exists
            $order_id = $response['order']['guid'] ?? null;
            if ($order_id === null) {
                $message = "Error creating order second.";
                return;
            }

            $uploadedFileName = $order_id . '.stl';
            $target_file = $target_dir . $uploadedFileName;

            // TODO: Check the file size of the uploaded file
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                $message = "The file " . htmlspecialchars(basename($_FILES["fileToUpload"]["name"])) . " has been uploaded.";
                $link = "<a href='/uploads/" . $uploadedFileName . "' class='view-link' target='_blank'>View it here</a>";
                $file_size = filesize($target_file);
                // TODO: Storing these as part of the session feels weird?
                $_SESSION['file_uploaded'] = true;
                // TODO: Check that this properly sanitizes the file name
                $_SESSION['uploaded_file'] = htmlspecialchars(basename($_FILES["fileToUpload"]["name"]));
                $_SESSION['order_id'] = $order_id;
            } else {
                $message = "Sorry, there was an error uploading your file.";
                $link = '';
            }
        } else {
            $message = "No file was uploaded.";
            $link = '';
        }
    
        // TODO: This seems wrong? Why is this here?
        if (isset($_POST['creationName'])) {
            $_SESSION['creationName'] = $_POST['creationName'];
        }
    }    
}

// NOTE: This is to make returning a different message easier
handle_upload();

// TODO: This seems like a weird thing to have?
$creationName = isset($_SESSION['creationName']) ? $_SESSION['creationName'] : '';
$uploadedFile = isset($_SESSION['uploaded_file']) ? $_SESSION['uploaded_file'] : '';
$order_id = isset($_SESSION['order_id']) ? $_SESSION['order_id'] : '';
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
                fileName: '<?php echo htmlspecialchars($uploadedFile); ?>'

            };

            window.location.href = `/payment?orderId=<?php echo $order_id; ?>`;
        });
    </script>
</body>
</html>

