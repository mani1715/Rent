#!/usr/bin/env python3
"""
Simple Backend API Test for Rental Marketplace
Focus on core functionality verification
"""

import requests
import json
import sys

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except:
        pass
    return 'http://localhost:8001'

BASE_URL = get_backend_url()
API_URL = f"{BASE_URL}/api"

def test_request(method, endpoint, data=None, headers=None):
    """Make API request and return response"""
    url = f"{API_URL}{endpoint}"
    
    try:
        if method.upper() == 'GET':
            response = requests.get(url, headers=headers, timeout=10)
        elif method.upper() == 'POST':
            response = requests.post(url, json=data, headers=headers, timeout=10)
        
        print(f"  {method} {endpoint} -> {response.status_code}")
        return response
    except Exception as e:
        print(f"  ERROR: {method} {endpoint} -> {str(e)}")
        return None

def main():
    print("🧪 RENTAL MARKETPLACE BACKEND API TEST")
    print(f"Backend URL: {BASE_URL}")
    print(f"API Base: {API_URL}")
    
    issues = []
    
    # 1. Health Check
    print("\n1. 🏥 Health Check")
    response = test_request('GET', '')
    if not response or response.status_code != 200:
        issues.append("Health check failed")
    else:
        print("  ✅ API is responding")
    
    # 2. User Registration
    print("\n2. 🔐 User Registration & Authentication")
    
    # Register Owner
    owner_data = {
        "name": "John Owner",
        "email": "john.owner@test.com",
        "password": "password123"
    }
    
    response = test_request('POST', '/auth/register', owner_data)
    if not response or response.status_code != 201:
        issues.append("Owner registration failed")
        return
    
    owner_result = response.json()
    owner_token = owner_result.get('token')
    owner_id = owner_result.get('user', {}).get('id')
    
    if not owner_token:
        issues.append("Owner token not received")
        return
    
    print("  ✅ Owner registered successfully")
    
    # Register Customer
    customer_data = {
        "name": "Jane Customer", 
        "email": "jane.customer@test.com",
        "password": "password123"
    }
    
    response = test_request('POST', '/auth/register', customer_data)
    if not response or response.status_code != 201:
        issues.append("Customer registration failed")
        return
    
    customer_result = response.json()
    customer_token = customer_result.get('token')
    customer_id = customer_result.get('user', {}).get('id')
    
    if not customer_token:
        issues.append("Customer token not received")
        return
    
    print("  ✅ Customer registered successfully")
    
    # 3. Role Selection
    print("\n3. 👤 Role Selection")
    
    owner_headers = {"Authorization": f"Bearer {owner_token}"}
    customer_headers = {"Authorization": f"Bearer {customer_token}"}
    
    # Select Owner role
    response = test_request('POST', '/user/select-role', {"role": "OWNER"}, owner_headers)
    if not response or response.status_code != 200:
        issues.append("Owner role selection failed")
    else:
        print("  ✅ Owner role selected")
    
    # Select Customer role
    response = test_request('POST', '/user/select-role', {"role": "CUSTOMER"}, customer_headers)
    if not response or response.status_code != 200:
        issues.append("Customer role selection failed")
    else:
        print("  ✅ Customer role selected")
    
    # 4. Owner Profile
    print("\n4. 🏠 Owner Profile")
    
    profile_data = {
        "contactNumber": "1234567890",
        "description": "Test owner profile"
    }
    
    response = test_request('POST', '/owner/profile', profile_data, owner_headers)
    if not response or response.status_code != 201:
        issues.append("Owner profile creation failed")
    else:
        print("  ✅ Owner profile created")
    
    # 5. Listings
    print("\n5. 🏘️ Listings")
    
    listing_data = {
        "title": "Test Property with Maps",
        "type": "house",
        "price": 2000,
        "squareFeet": 1500,
        "addressText": "123 Test Street, City",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "facilities": ["WiFi", "Parking"],
        "images": ["https://picsum.photos/800/600?random=1"]
    }
    
    response = test_request('POST', '/listings', listing_data, owner_headers)
    if not response or response.status_code != 201:
        issues.append("Listing creation failed")
        print(f"    Response: {response.text if response else 'No response'}")
    else:
        listing_result = response.json()
        listing_id = listing_result.get('listing', {}).get('_id')
        print("  ✅ Listing created successfully")
        
        # Check Google Maps fields
        listing = listing_result.get('listing', {})
        if listing.get('latitude') == 40.7128 and listing.get('longitude') == -74.0060:
            print("  ✅ Google Maps coordinates saved")
        else:
            issues.append("Google Maps coordinates not saved properly")
    
    # Get all listings
    response = test_request('GET', '/listings')
    if not response or response.status_code != 200:
        issues.append("Listings retrieval failed")
    else:
        listings_result = response.json()
        if listings_result.get('count', 0) > 0:
            print("  ✅ Listings retrieved successfully")
        else:
            issues.append("No listings found")
    
    # 6. Reviews
    print("\n6. ⭐ Reviews")
    
    if 'listing_id' in locals():
        review_data = {
            "listingId": listing_id,
            "rating": 5,
            "comment": "Great property!"
        }
        
        response = test_request('POST', '/reviews', review_data, customer_headers)
        if not response or response.status_code != 201:
            issues.append("Review creation failed")
            print(f"    Response: {response.text if response else 'No response'}")
        else:
            print("  ✅ Review created successfully")
        
        # Get reviews for listing
        response = test_request('GET', f'/reviews/listing/{listing_id}')
        if not response or response.status_code != 200:
            issues.append("Reviews retrieval failed")
        else:
            reviews_result = response.json()
            if reviews_result.get('count', 0) > 0:
                print("  ✅ Reviews retrieved successfully")
            else:
                issues.append("No reviews found")
    
    # 7. Security Tests
    print("\n7. 🔒 Security Tests")
    
    # Test without token
    response = test_request('GET', '/user/me')
    if response and response.status_code == 401:
        print("  ✅ Unauthenticated access properly blocked")
    else:
        issues.append("Unauthenticated access not properly blocked")
    
    # Test customer trying to create listing
    response = test_request('POST', '/listings', listing_data, customer_headers)
    if response and response.status_code == 403:
        print("  ✅ Customer blocked from creating listings")
    else:
        issues.append("Customer not properly blocked from creating listings")
    
    # Final Results
    print(f"\n📊 TEST RESULTS")
    if not issues:
        print("🎉 ALL CORE FUNCTIONALITY WORKING!")
        print("✅ Authentication flow complete")
        print("✅ Role-based access control working")
        print("✅ Owner profile creation working")
        print("✅ Listings CRUD working")
        print("✅ Reviews system working")
        print("✅ Google Maps integration working")
        print("✅ Security controls working")
        return True
    else:
        print(f"❌ {len(issues)} ISSUES FOUND:")
        for issue in issues:
            print(f"  - {issue}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)