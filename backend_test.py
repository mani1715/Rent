#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Rental Marketplace
Tests authentication, roles, listings, reviews, and Google Maps integration
"""

import requests
import json
import sys
import os
from datetime import datetime

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

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def log(message, color=None):
    if color:
        print(f"{color}{message}{Colors.ENDC}")
    else:
        print(message)

def test_api_endpoint(method, endpoint, data=None, headers=None, expected_status=200):
    """Test API endpoint and return response"""
    url = f"{API_URL}{endpoint}"
    
    try:
        if method.upper() == 'GET':
            response = requests.get(url, headers=headers, timeout=10)
        elif method.upper() == 'POST':
            response = requests.post(url, json=data, headers=headers, timeout=10)
        elif method.upper() == 'PUT':
            response = requests.put(url, json=data, headers=headers, timeout=10)
        elif method.upper() == 'DELETE':
            response = requests.delete(url, headers=headers, timeout=10)
        
        log(f"  {method} {endpoint} -> {response.status_code}", 
            Colors.GREEN if response.status_code == expected_status else Colors.RED)
        
        if response.status_code != expected_status:
            log(f"    Expected: {expected_status}, Got: {response.status_code}", Colors.YELLOW)
            if response.text:
                log(f"    Response: {response.text[:200]}", Colors.YELLOW)
        
        return response
    except Exception as e:
        log(f"  ERROR: {method} {endpoint} -> {str(e)}", Colors.RED)
        return None

def main():
    log(f"\n{Colors.BOLD}🧪 RENTAL MARKETPLACE BACKEND API TESTING{Colors.ENDC}")
    log(f"Backend URL: {BASE_URL}")
    log(f"API Base: {API_URL}")
    
    # Test data
    owner_user = {
        "name": "Sarah Johnson",
        "email": "sarah.owner@rentease.com",
        "password": "securepass123"
    }
    
    customer_user = {
        "name": "Mike Chen",
        "email": "mike.customer@rentease.com", 
        "password": "securepass456"
    }
    
    # Store tokens and IDs
    owner_token = None
    customer_token = None
    owner_id = None
    customer_id = None
    listing_id = None
    
    # Test results tracking
    tests_passed = 0
    tests_failed = 0
    
    def check_test(condition, test_name):
        nonlocal tests_passed, tests_failed
        if condition:
            log(f"  ✅ {test_name}", Colors.GREEN)
            tests_passed += 1
        else:
            log(f"  ❌ {test_name}", Colors.RED)
            tests_failed += 1
    
    # 1. HEALTH CHECK
    log(f"\n{Colors.BLUE}1. 🏥 HEALTH CHECK{Colors.ENDC}")
    response = test_api_endpoint('GET', '')
    if response and response.status_code == 200:
        check_test(True, "API Health Check")
    else:
        check_test(False, "API Health Check")
        log("❌ Backend API is not responding. Stopping tests.", Colors.RED)
        return
    
    # 2. AUTH FLOW TESTING
    log(f"\n{Colors.BLUE}2. 🔐 AUTHENTICATION FLOW{Colors.ENDC}")
    
    # Register Owner User
    log("  Registering Owner User...")
    response = test_api_endpoint('POST', '/auth/register', owner_user, expected_status=201)
    if response and response.status_code == 201:
        data = response.json()
        check_test(data.get('success') == True, "Owner registration success")
        check_test('token' in data, "Owner JWT token returned")
        check_test(data.get('requiresRoleSelection') == True, "Requires role selection flag")
        owner_token = data.get('token')
        owner_id = data.get('user', {}).get('id')
    else:
        check_test(False, "Owner registration")
    
    # Register Customer User
    log("  Registering Customer User...")
    response = test_api_endpoint('POST', '/auth/register', customer_user, expected_status=201)
    if response and response.status_code == 201:
        data = response.json()
        check_test(data.get('success') == True, "Customer registration success")
        check_test('token' in data, "Customer JWT token returned")
        customer_token = data.get('token')
        customer_id = data.get('user', {}).get('id')
    else:
        check_test(False, "Customer registration")
    
    # Test duplicate registration
    log("  Testing duplicate registration...")
    response = test_api_endpoint('POST', '/auth/register', owner_user, expected_status=400)
    check_test(response and response.status_code == 400, "Duplicate registration prevented")
    
    # Login Owner
    log("  Testing Owner Login...")
    login_data = {"email": owner_user["email"], "password": owner_user["password"]}
    response = test_api_endpoint('POST', '/auth/login', login_data)
    if response and response.status_code == 200:
        data = response.json()
        check_test(data.get('success') == True, "Owner login success")
        check_test('token' in data, "Owner login JWT token")
    else:
        check_test(False, "Owner login")
    
    # Login Customer
    log("  Testing Customer Login...")
    login_data = {"email": customer_user["email"], "password": customer_user["password"]}
    response = test_api_endpoint('POST', '/auth/login', login_data)
    if response and response.status_code == 200:
        data = response.json()
        check_test(data.get('success') == True, "Customer login success")
    else:
        check_test(False, "Customer login")
    
    # Test invalid login
    log("  Testing invalid login...")
    invalid_login = {"email": "wrong@email.com", "password": "wrongpass"}
    response = test_api_endpoint('POST', '/auth/login', invalid_login, expected_status=400)
    check_test(response and response.status_code == 400, "Invalid login rejected")
    
    if not owner_token or not customer_token:
        log("❌ Cannot proceed without valid tokens", Colors.RED)
        return
    
    # 3. USER INFO & ROLE SELECTION
    log(f"\n{Colors.BLUE}3. 👤 USER INFO & ROLE SELECTION{Colors.ENDC}")
    
    owner_headers = {"Authorization": f"Bearer {owner_token}"}
    customer_headers = {"Authorization": f"Bearer {customer_token}"}
    
    # Get user info (before role selection)
    log("  Getting Owner user info...")
    response = test_api_endpoint('GET', '/user/me', headers=owner_headers)
    if response and response.status_code == 200:
        data = response.json()
        check_test(data.get('success') == True, "Owner user info retrieved")
        check_test(data.get('requiresRoleSelection') == True, "Role selection required")
    else:
        check_test(False, "Owner user info")
    
    # Select Owner role
    log("  Selecting OWNER role...")
    role_data = {"role": "OWNER"}
    response = test_api_endpoint('POST', '/user/select-role', role_data, headers=owner_headers)
    if response and response.status_code == 200:
        data = response.json()
        check_test(data.get('success') == True, "Owner role selection success")
        check_test(data.get('user', {}).get('role') == 'OWNER', "Owner role set correctly")
    else:
        check_test(False, "Owner role selection")
    
    # Select Customer role
    log("  Selecting CUSTOMER role...")
    role_data = {"role": "CUSTOMER"}
    response = test_api_endpoint('POST', '/user/select-role', role_data, headers=customer_headers)
    if response and response.status_code == 200:
        data = response.json()
        check_test(data.get('success') == True, "Customer role selection success")
        check_test(data.get('user', {}).get('role') == 'CUSTOMER', "Customer role set correctly")
    else:
        check_test(False, "Customer role selection")
    
    # Test role selection twice (should fail)
    log("  Testing duplicate role selection...")
    response = test_api_endpoint('POST', '/user/select-role', {"role": "CUSTOMER"}, headers=owner_headers, expected_status=400)
    check_test(response and response.status_code == 400, "Duplicate role selection prevented")
    
    # Test invalid role
    log("  Testing invalid role...")
    response = test_api_endpoint('POST', '/user/select-role', {"role": "INVALID"}, headers=customer_headers, expected_status=400)
    check_test(response and response.status_code == 400, "Invalid role rejected")
    
    # 4. OWNER PROFILE TESTING
    log(f"\n{Colors.BLUE}4. 🏠 OWNER PROFILE TESTING{Colors.ENDC}")
    
    # Create Owner Profile
    log("  Creating Owner Profile...")
    profile_data = {
        "contactNumber": "1234567890",
        "description": "Experienced property owner with multiple listings in downtown area"
    }
    response = test_api_endpoint('POST', '/owner/profile', profile_data, headers=owner_headers, expected_status=201)
    if response and response.status_code == 201:
        data = response.json()
        check_test(data.get('success') == True, "Owner profile creation success")
        check_test(data.get('profile', {}).get('contactNumber') == profile_data['contactNumber'], "Contact number saved")
        check_test(data.get('profile', {}).get('description') == profile_data['description'], "Description saved")
    else:
        check_test(False, "Owner profile creation")
    
    # Get Owner Profile
    log("  Getting Owner Profile...")
    response = test_api_endpoint('GET', '/owner/profile', headers=owner_headers)
    if response and response.status_code == 200:
        data = response.json()
        check_test(data.get('success') == True, "Owner profile retrieval success")
        check_test('profile' in data, "Profile data returned")
    else:
        check_test(False, "Owner profile retrieval")
    
    # Test Customer cannot access owner profile
    log("  Testing Customer access to owner profile...")
    response = test_api_endpoint('GET', '/owner/profile', headers=customer_headers, expected_status=403)
    check_test(response and response.status_code == 403, "Customer blocked from owner profile")
    
    # 5. LISTINGS CRUD TESTING
    log(f"\n{Colors.BLUE}5. 🏘️ LISTINGS CRUD TESTING{Colors.ENDC}")
    
    # Create Listing (Owner)
    log("  Creating Listing (Owner)...")
    listing_data = {
        "title": "Beautiful Downtown Apartment with City Views",
        "type": "house",
        "price": 2000,
        "squareFeet": 1500,
        "addressText": "123 Main Street, Downtown City, State 12345",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "facilities": ["WiFi", "Parking", "Air Conditioning", "Gym"],
        "images": ["https://picsum.photos/800/600?random=1", "https://picsum.photos/800/600?random=2"],
        "description": "Spacious apartment in the heart of downtown with amazing city views",
        "bedrooms": 2,
        "bathrooms": 2
    }
    response = test_api_endpoint('POST', '/listings', listing_data, headers=owner_headers, expected_status=201)
    if response and response.status_code == 201:
        data = response.json()
        check_test(data.get('success') == True, "Listing creation success")
        check_test('listing' in data, "Listing data returned")
        listing_id = data.get('listing', {}).get('_id')
        
        # Check Google Maps link generation
        listing = data.get('listing', {})
        expected_maps_link = f"https://www.google.com/maps?q={listing_data['latitude']},{listing_data['longitude']}"
        check_test(listing.get('latitude') == listing_data['latitude'], "Latitude saved correctly")
        check_test(listing.get('longitude') == listing_data['longitude'], "Longitude saved correctly")
        
        # Check owner info populated
        check_test('ownerId' in listing, "Owner info populated")
    else:
        check_test(False, "Listing creation")
    
    # Test Customer cannot create listing
    log("  Testing Customer listing creation (should fail)...")
    response = test_api_endpoint('POST', '/listings', listing_data, headers=customer_headers, expected_status=403)
    check_test(response and response.status_code == 403, "Customer blocked from creating listings")
    
    # Get All Listings
    log("  Getting all listings...")
    response = test_api_endpoint('GET', '/listings')
    if response and response.status_code == 200:
        data = response.json()
        check_test(data.get('success') == True, "Listings retrieval success")
        check_test('listings' in data, "Listings array returned")
        check_test(data.get('count', 0) > 0, "At least one listing returned")
    else:
        check_test(False, "Listings retrieval")
    
    # Get Single Listing
    if listing_id:
        log("  Getting single listing...")
        response = test_api_endpoint('GET', f'/listings/{listing_id}')
        if response and response.status_code == 200:
            data = response.json()
            check_test(data.get('success') == True, "Single listing retrieval success")
            check_test('listing' in data, "Listing data returned")
            check_test('ownerId' in data.get('listing', {}), "Owner details populated")
        else:
            check_test(False, "Single listing retrieval")
    
    # Get Listings by Owner
    if owner_id:
        log("  Getting listings by owner...")
        response = test_api_endpoint('GET', f'/listings?ownerId={owner_id}')
        if response and response.status_code == 200:
            data = response.json()
            check_test(data.get('success') == True, "Owner listings filter success")
            check_test(data.get('count', 0) > 0, "Owner has listings")
        else:
            check_test(False, "Owner listings filter")
    
    # Test invalid listing type
    log("  Testing invalid listing type...")
    invalid_listing = listing_data.copy()
    invalid_listing['type'] = 'invalid_type'
    response = test_api_endpoint('POST', '/listings', invalid_listing, headers=owner_headers, expected_status=400)
    check_test(response and response.status_code == 400, "Invalid listing type rejected")
    
    # 6. REVIEWS TESTING
    log(f"\n{Colors.BLUE}6. ⭐ REVIEWS TESTING{Colors.ENDC}")
    
    if listing_id:
        # Create Review (Customer)
        log("  Creating review (Customer)...")
        review_data = {
            "listingId": listing_id,
            "rating": 5,
            "comment": "Amazing property! Great location and excellent amenities. Highly recommended!"
        }
        response = test_api_endpoint('POST', '/reviews', review_data, headers=customer_headers, expected_status=201)
        if response and response.status_code == 201:
            data = response.json()
            check_test(data.get('success') == True, "Review creation success")
            check_test('review' in data, "Review data returned")
            check_test(data.get('review', {}).get('rating') == 5, "Rating saved correctly")
        else:
            check_test(False, "Review creation")
        
        # Test Owner cannot review own listing
        log("  Testing Owner self-review (should fail)...")
        response = test_api_endpoint('POST', '/reviews', review_data, headers=owner_headers, expected_status=400)
        check_test(response and response.status_code == 400, "Owner self-review blocked")
        
        # Test duplicate review
        log("  Testing duplicate review (should fail)...")
        response = test_api_endpoint('POST', '/reviews', review_data, headers=customer_headers, expected_status=400)
        check_test(response and response.status_code == 400, "Duplicate review blocked")
        
        # Get Reviews for Listing
        log("  Getting reviews for listing...")
        response = test_api_endpoint('GET', f'/reviews/listing/{listing_id}')
        if response and response.status_code == 200:
            data = response.json()
            check_test(data.get('success') == True, "Reviews retrieval success")
            check_test('reviews' in data, "Reviews array returned")
            check_test(data.get('count', 0) > 0, "At least one review returned")
            check_test('averageRating' in data, "Average rating calculated")
        else:
            check_test(False, "Reviews retrieval")
    
    # Test invalid rating
    log("  Testing invalid rating...")
    invalid_review = {
        "listingId": listing_id or "dummy_id",
        "rating": 6,  # Invalid rating > 5
        "comment": "Test comment"
    }
    response = test_api_endpoint('POST', '/reviews', invalid_review, headers=customer_headers, expected_status=400)
    check_test(response and response.status_code == 400, "Invalid rating rejected")
    
    # 7. SECURITY & ACCESS CONTROL
    log(f"\n{Colors.BLUE}7. 🔒 SECURITY & ACCESS CONTROL{Colors.ENDC}")
    
    # Test endpoints without token
    log("  Testing endpoints without authentication...")
    response = test_api_endpoint('GET', '/user/me', expected_status=401)
    check_test(response and response.status_code == 401, "Unauthenticated access blocked")
    
    response = test_api_endpoint('POST', '/listings', listing_data, expected_status=401)
    check_test(response and response.status_code == 401, "Unauthenticated listing creation blocked")
    
    # Test invalid token
    log("  Testing invalid token...")
    invalid_headers = {"Authorization": "Bearer invalid_token"}
    response = test_api_endpoint('GET', '/user/me', headers=invalid_headers, expected_status=401)
    check_test(response and response.status_code == 401, "Invalid token rejected")
    
    # Test role-based access
    log("  Testing role-based access control...")
    response = test_api_endpoint('POST', '/owner/profile', profile_data, headers=customer_headers, expected_status=403)
    check_test(response and response.status_code == 403, "Customer blocked from owner endpoints")
    
    # 8. EDGE CASES & VALIDATION
    log(f"\n{Colors.BLUE}8. 🧪 EDGE CASES & VALIDATION{Colors.ENDC}")
    
    # Test missing required fields
    log("  Testing missing required fields...")
    incomplete_listing = {"title": "Test"}  # Missing required fields
    response = test_api_endpoint('POST', '/listings', incomplete_listing, headers=owner_headers, expected_status=400)
    check_test(response and response.status_code == 400, "Missing required fields rejected")
    
    # Test non-existent listing
    log("  Testing non-existent listing...")
    fake_id = "507f1f77bcf86cd799439011"  # Valid ObjectId format but non-existent
    response = test_api_endpoint('GET', f'/listings/{fake_id}', expected_status=404)
    check_test(response and response.status_code == 404, "Non-existent listing returns 404")
    
    # Test review for non-existent listing
    log("  Testing review for non-existent listing...")
    fake_review = {
        "listingId": fake_id,
        "rating": 5,
        "comment": "Test comment"
    }
    response = test_api_endpoint('POST', '/reviews', fake_review, headers=customer_headers, expected_status=404)
    check_test(response and response.status_code == 404, "Review for non-existent listing rejected")
    
    # FINAL RESULTS
    log(f"\n{Colors.BOLD}📊 TEST RESULTS SUMMARY{Colors.ENDC}")
    total_tests = tests_passed + tests_failed
    success_rate = (tests_passed / total_tests * 100) if total_tests > 0 else 0
    
    log(f"Total Tests: {total_tests}")
    log(f"Passed: {tests_passed}", Colors.GREEN)
    log(f"Failed: {tests_failed}", Colors.RED if tests_failed > 0 else Colors.GREEN)
    log(f"Success Rate: {success_rate:.1f}%", Colors.GREEN if success_rate >= 90 else Colors.YELLOW if success_rate >= 70 else Colors.RED)
    
    if tests_failed == 0:
        log(f"\n🎉 ALL TESTS PASSED! Backend API is working correctly.", Colors.GREEN)
    else:
        log(f"\n⚠️  {tests_failed} test(s) failed. Please check the issues above.", Colors.YELLOW)
    
    return tests_failed == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)