# Date: 11/20/2021
# Author: Yousaf K Hamza
# Description: Instagram DP Downloader with URL

import instaloader
import os

def download_profile_pic(username):
    # Create instance
    L = instaloader.Instaloader(dirname_pattern="./dp")
    
    try:
        # Get profile
        profile = instaloader.Profile.from_username(L.context, username)
        
        # Create dp directory if it doesn't exist
        if not os.path.exists("./dp"):
            os.makedirs("./dp")
            
        # Download profile picture
        L.download_profilepic(profile)
        print(L.download_profilepic(profile))
        return {"success": True, "message": f"Profile picture downloaded for {username}"}
        
    except Exception as e:
        return {"success": False, "message": str(e)}

if __name__ == "__main__":
    username = input('Instagram Username: ')
    result = download_profile_pic(username)
    print(result)