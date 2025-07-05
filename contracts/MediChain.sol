// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FileStorage {
    // Structure to store file metadata
    struct FileMetadata {
        uint256 id;
        string fileName;
        string fileType; // image, document, pdf, etc.
        string ipfsHash; // IPFS hash where actual file is stored
        uint256 fileSize; // Size in bytes
        string description;
        address owner;
        uint256 uploadTimestamp;
        bool isPublic;
        bool isActive;
        string[] tags; // Tags for categorization
    }
    
    // Structure for file sharing permissions
    struct SharePermission {
        address sharedWith;
        uint256 expirationTime;
        bool canDownload;
        bool canView;
    }
    
    // State variables
    mapping(uint256 => FileMetadata) public files;
    mapping(address => uint256[]) public userFiles;
    mapping(uint256 => SharePermission[]) public filePermissions;
    mapping(bytes32 => bool) public ipfsHashExists;
    
    uint256 public totalFiles;
    uint256 private nextFileId;
    
    // Events
    event FileUploaded(
        uint256 indexed fileId, 
        address indexed owner, 
        string fileName, 
        string ipfsHash
    );
    event FileUpdated(uint256 indexed fileId, address indexed owner);
    event FileDeleted(uint256 indexed fileId, address indexed owner);
    event FileShared(
        uint256 indexed fileId, 
        address indexed owner, 
        address indexed sharedWith
    );
    event FileAccessRevoked(
        uint256 indexed fileId, 
        address indexed owner, 
        address indexed revokedFrom
    );
    
    // Modifiers
    modifier onlyOwner(uint256 _fileId) {
        require(files[_fileId].owner == msg.sender, "Not the owner of this file");
        _;
    }
    
    modifier validFile(uint256 _fileId) {
        require(_fileId > 0 && _fileId <= nextFileId, "Invalid file ID");
        require(files[_fileId].isActive, "File not active");
        _;
    }
    
    modifier canAccessFile(uint256 _fileId) {
        require(
            files[_fileId].owner == msg.sender || 
            files[_fileId].isPublic || 
            hasPermission(_fileId, msg.sender),
            "No permission to access this file"
        );
        _;
    }
    
    // Constructor
    constructor() {
        nextFileId = 1;
        totalFiles = 0;
    }
    
    // Upload file metadata
    function uploadFile(
        string memory _fileName,
        string memory _fileType,
        string memory _ipfsHash,
        uint256 _fileSize,
        string memory _description,
        bool _isPublic,
        string[] memory _tags
    ) public returns (uint256) {
        require(bytes(_fileName).length > 0, "File name cannot be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(_fileSize > 0, "File size must be greater than 0");
        
        bytes32 hashKey = keccak256(abi.encodePacked(_ipfsHash));
        require(!ipfsHashExists[hashKey], "File with this IPFS hash already exists");
        
        uint256 newFileId = nextFileId;
        
        files[newFileId] = FileMetadata({
            id: newFileId,
            fileName: _fileName,
            fileType: _fileType,
            ipfsHash: _ipfsHash,
            fileSize: _fileSize,
            description: _description,
            owner: msg.sender,
            uploadTimestamp: block.timestamp,
            isPublic: _isPublic,
            isActive: true,
            tags: _tags
        });
        
        userFiles[msg.sender].push(newFileId);
        ipfsHashExists[hashKey] = true;
        totalFiles++;
        nextFileId++;
        
        emit FileUploaded(newFileId, msg.sender, _fileName, _ipfsHash);
        return newFileId;
    }
    
    // Update file metadata (not the actual file)
    function updateFileMetadata(
        uint256 _fileId,
        string memory _fileName,
        string memory _description,
        bool _isPublic,
        string[] memory _tags
    ) public onlyOwner(_fileId) validFile(_fileId) {
        require(bytes(_fileName).length > 0, "File name cannot be empty");
        
        files[_fileId].fileName = _fileName;
        files[_fileId].description = _description;
        files[_fileId].isPublic = _isPublic;
        files[_fileId].tags = _tags;
        
        emit FileUpdated(_fileId, msg.sender);
    }
    
    // Delete file (soft delete)
    function deleteFile(uint256 _fileId) public onlyOwner(_fileId) validFile(_fileId) {
        files[_fileId].isActive = false;
        totalFiles--;
        
        // Clear IPFS hash existence
        bytes32 hashKey = keccak256(abi.encodePacked(files[_fileId].ipfsHash));
        ipfsHashExists[hashKey] = false;
        
        emit FileDeleted(_fileId, msg.sender);
    }
    
    // Get file metadata
    function getFile(uint256 _fileId) public view validFile(_fileId) canAccessFile(_fileId) returns (
        uint256 id,
        string memory fileName,
        string memory fileType,
        string memory ipfsHash,
        uint256 fileSize,
        string memory description,
        address owner,
        uint256 uploadTimestamp,
        bool isPublic,
        string[] memory tags
    ) {
        FileMetadata memory file = files[_fileId];
        return (
            file.id,
            file.fileName,
            file.fileType,
            file.ipfsHash,
            file.fileSize,
            file.description,
            file.owner,
            file.uploadTimestamp,
            file.isPublic,
            file.tags
        );
    }
    
    // Share file with another user
    function shareFile(
        uint256 _fileId,
        address _shareWith,
        uint256 _expirationTime,
        bool _canDownload,
        bool _canView
    ) public onlyOwner(_fileId) validFile(_fileId) {
        require(_shareWith != address(0), "Invalid address");
        require(_shareWith != msg.sender, "Cannot share with yourself");
        require(_expirationTime > block.timestamp, "Expiration time must be in the future");
        
        filePermissions[_fileId].push(SharePermission({
            sharedWith: _shareWith,
            expirationTime: _expirationTime,
            canDownload: _canDownload,
            canView: _canView
        }));
        
        emit FileShared(_fileId, msg.sender, _shareWith);
    }
    
    // Revoke file access
    function revokeFileAccess(uint256 _fileId, address _revokeFrom) 
        public 
        onlyOwner(_fileId) 
        validFile(_fileId) 
    {
        SharePermission[] storage permissions = filePermissions[_fileId];
        
        for (uint256 i = 0; i < permissions.length; i++) {
            if (permissions[i].sharedWith == _revokeFrom) {
                // Move last element to current position and remove last element
                permissions[i] = permissions[permissions.length - 1];
                permissions.pop();
                break;
            }
        }
        
        emit FileAccessRevoked(_fileId, msg.sender, _revokeFrom);
    }
    
    // Check if user has permission to access file
    function hasPermission(uint256 _fileId, address _user) public view returns (bool) {
        SharePermission[] memory permissions = filePermissions[_fileId];
        
        for (uint256 i = 0; i < permissions.length; i++) {
            if (permissions[i].sharedWith == _user && 
                permissions[i].expirationTime > block.timestamp) {
                return true;
            }
        }
        return false;
    }
    
    // Get user's files
    function getUserFiles(address _user) public view returns (uint256[] memory) {
        uint256[] memory userFileIds = userFiles[_user];
        uint256 activeCount = 0;
        
        // Count active files
        for (uint256 i = 0; i < userFileIds.length; i++) {
            if (files[userFileIds[i]].isActive) {
                activeCount++;
            }
        }
        
        // Create array of active files
        uint256[] memory activeFiles = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < userFileIds.length; i++) {
            if (files[userFileIds[i]].isActive) {
                activeFiles[index] = userFileIds[i];
                index++;
            }
        }
        
        return activeFiles;
    }
    
    // Get public files (paginated)
    function getPublicFiles(uint256 _offset, uint256 _limit) public view returns (
        uint256[] memory fileIds,
        string[] memory fileNames,
        string[] memory fileTypes,
        address[] memory owners,
        uint256[] memory timestamps
    ) {
        require(_limit > 0 && _limit <= 100, "Limit must be between 1 and 100");
        
        uint256[] memory publicIds = new uint256[](_limit);
        string[] memory publicNames = new string[](_limit);
        string[] memory publicTypes = new string[](_limit);
        address[] memory publicOwners = new address[](_limit);
        uint256[] memory publicTimestamps = new uint256[](_limit);
        
        uint256 found = 0;
        uint256 skipped = 0;
        
        for (uint256 i = 1; i <= nextFileId && found < _limit; i++) {
            if (files[i].isActive && files[i].isPublic) {
                if (skipped >= _offset) {
                    publicIds[found] = files[i].id;
                    publicNames[found] = files[i].fileName;
                    publicTypes[found] = files[i].fileType;
                    publicOwners[found] = files[i].owner;
                    publicTimestamps[found] = files[i].uploadTimestamp;
                    found++;
                } else {
                    skipped++;
                }
            }
        }
        
        // Resize arrays
        assembly {
            mstore(publicIds, found)
            mstore(publicNames, found)
            mstore(publicTypes, found)
            mstore(publicOwners, found)
            mstore(publicTimestamps, found)
        }
        
        return (publicIds, publicNames, publicTypes, publicOwners, publicTimestamps);
    }
    
    // Search files by file type
    function getFilesByType(string memory _fileType) public view returns (uint256[] memory) {
        uint256[] memory matchingFiles = new uint256[](totalFiles);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= nextFileId; i++) {
            if (files[i].isActive && 
                files[i].isPublic && 
                keccak256(abi.encodePacked(files[i].fileType)) == keccak256(abi.encodePacked(_fileType))) {
                matchingFiles[count] = i;
                count++;
            }
        }
        
        // Resize array
        assembly {
            mstore(matchingFiles, count)
        }
        
        return matchingFiles;
    }
    
    // Get files shared with user
    function getSharedFiles(address _user) public view returns (uint256[] memory) {
        uint256[] memory sharedFiles = new uint256[](totalFiles);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= nextFileId; i++) {
            if (files[i].isActive && hasPermission(i, _user)) {
                sharedFiles[count] = i;
                count++;
            }
        }
        
        // Resize array
        assembly {
            mstore(sharedFiles, count)
        }
        
        return sharedFiles;
    }
    
    // Get file permissions
    function getFilePermissions(uint256 _fileId) public view onlyOwner(_fileId) returns (
        address[] memory sharedWith,
        uint256[] memory expirationTimes,
        bool[] memory canDownload,
        bool[] memory canView
    ) {
        SharePermission[] memory permissions = filePermissions[_fileId];
        
        address[] memory addresses = new address[](permissions.length);
        uint256[] memory expirations = new uint256[](permissions.length);
        bool[] memory downloads = new bool[](permissions.length);
        bool[] memory views = new bool[](permissions.length);
        
        for (uint256 i = 0; i < permissions.length; i++) {
            addresses[i] = permissions[i].sharedWith;
            expirations[i] = permissions[i].expirationTime;
            downloads[i] = permissions[i].canDownload;
            views[i] = permissions[i].canView;
        }
        
        return (addresses, expirations, downloads, views);
    }
}