https://event-hub-frontend-30c8bbf9de26.herokuapp.com/

# Event Hub (Front-End)

  ## Introduction

The **Event Hub** is a front-end web application designed to showcase and manage live music events. This application serves as a user-friendly platform where music lovers can:

- Explore upcoming music events.

- Interact with other attendees through comments.

- Follow musicians and event organizers.

- Maintain personalized user profiles.

The project is connected to a separate **Django-based backend**, which handles:

- User authentication and role management.

- Event creation, modification, and retrieval.

- Commenting system.

- Profile and user data processing.

---

## Target Audience

**Event Hub** is designed for a diverse audience with a shared passion for music events. It caters to:

### 🎶 **Music Enthusiasts**

- Users looking for **upcoming music events**.

- Fans who want to **engage in discussions** and leave comments about events.

- Individuals who enjoy **following musicians**.

### 🎤 **Musicians**

- Artists who want to **showcase their talent** and connect with event organisers.

- Musicians looking for **gig opportunities** and event collaborations.

- Performers who want to **share their genre and instruments** with followers.

### 🎟️ **Event Organisers**

- Organisers who want to **create, manage, and promote events**.

- Event planners looking for **musicians to book for live performances**.

- Professionals seeking an easy-to-use **platform for event promotion**.

### 🌍 **General Public**

- Anyone interested in **exploring live music experiences**.

- Individuals who want to **engage with their favorite artists**.

- Users who appreciate a **centralised hub for music events**.

This platform is built to **bridge the gap** between music fans, artists, and event organizers, creating a **vibrant and interactive music community**.

---
  
## Table of Contents

- [Introduction](#introduction)

- [The Strategy Plane](#the-strategy-plane)

- [Site Goals](#site-goals)

- [Agile Planning](#agile-planning)

  - [Epics](#epics)

    - [User Stories](#user-stories)

- [The Structure Plane](#the-structure-plane)

  - [Features](#features)

    - [User Roles & Permissions](#user-roles--permissions)

    - [Navigation Menu](#navigation-menu)

    - [Home](#home)

    - [Events](#events)

    - [Comments](#comments)

    - [Profiles](#profiles)

- [Potential Future Features](#future-features)

- [The Skeleton Plane](#the-skeleton-plane)

  - [Wireframes](#wireframes)

  - [The Surface Plane](#the-surface-plane)

  - [Design](#design)

  - [Colour Scheme](#colour-scheme)

  - [Typography](#typography)

- [Technologies](#technologies)

- [Testing](#testing)

- [Deployment](#deployment)

- [Heroku Deployment](#heroku-deployment)

- [Version Control](#version-control)

- [Run Locally](#run-locally)

- [Forking](#forking)

- [Credits](#credits)

- [Content](#content)

---

## The Strategy Plane


### Site Goals

- Provide a dynamic and engaging platform for music lovers to discover events.

- Allow different types of users (Basic, Musician, Organiser) to interact uniquely.

- Offer event organizers tools to manage and promote their events.

- Enable musicians to view their upcoming and past performances.

- Ensure a responsive, intuitive UI with a seamless user experience.

### Agile Planning

The project follows an **Agile Development Process**, with a focus on:

- Iterative development through epics.
 

### Epics

- **Navigation and Authentication**

- **Event**

- **Commenting**

- **Profile Customization & Follow System**

- **Musician Profile & Event Association**

### User Stories

1. As a **basic user**, I want to browse and follow events so that I can stay updated.

2. As a **basic user**, I want to comment on events to engage with other attendees.

3. As a **basic user**, I want to upgrade my role to either **musician** or **organiser**.

4. As a **musician**, I want to list my genre and instruments on my profile.

5. As a **musician**, I want to see upcoming and past events that I have been tagged in.

6. As an **organiser**, I want to create, edit, and manage my events.

7. As an **organiser**, I want to tag musicians in my events to showcase performances.

---

## The Structure Plane

## Features

**Event Hub** offers a range of features tailored to different user roles: **Basic, Musicians, and Organizers**. Below are the key functionalities:

### 🎨 **UI & Navigation**
- **Favicon & Logo**: A recognizable branding identity across all pages.
- **Navbar**: Provides quick navigation to key areas like events, profile, and authentication options.

### 🏡 **Landing Page (Home)**
The landing page dynamically changes based on the user's authentication and role:
- **Not Signed In**: 
  - Call-to-action (CTA) to **sign in / sign up**, and to **view events**.
  - Sliding carousel of **events**.
- **Signed In Role: Basic User**:
  - CTAs to **upgrade account** links to **edit profile form**.
  - Sliding carousel of **events**.
- **Signed In Role: Musician**:
  - CTAs to **view profile** and **explore events**.
  - Sliding carousel displaying **events the musician is tagged in**.
- **Signed In Role: Organizer**:
  - CTAs to **create a new event** and **view profile**.
  - Carousel displaying **events** created by the user.
- **Event Carousel:** Displays **a minimized version of events**, showing only:
  - **Title**
  - **Date**
  - **Location**
  - **CTA** to view event detail

### **Events**
- **Events Page**:
  - Displays a **list of events**.
  - Filter options:
    - **Location**
    - **Musician(s)**
- **Create Event**:
  - Fields:
    - **Image**
    - **Title**
    - **Description**
    - **Date/Time**
    - **Musicians** (can tag profiles with **role** of **musician**)
    - **Location**
- **Event Detail Page**:
  - Full event details and interactions.
- **Edit Event**:
  - Users with **organizer role** can update **events** that they are the owner of.
  - Fields:
    - **Image**
    - **Title**
    - **Description**
    - **Date/Time**
    - **Musicians** (can update tagged musicians)
    - **Location**
- **Delete Event**:
  - Organizers can remove their events.

### 💬 **Interactions**
- **Commenting System**:
  - **Add a comment** to an event.
  - **Edit a comment** (only the owner of the comment can edit).
  - **Delete a comment** (only the owner of the comment can delete).
  
- **Follow System**:
  - Users can **follow/unfollow** other users.

### **User Profiles**
- **Basic Profile**:
  - Displays:
    - **Full Name** ( Set to blank on sign up )
    - **Bio** ( Set to blank on sign up )
    - **Joined date**
    - **Followed users count**
    - **Followers count**
    - **User role**
- **Musician Profile**:
  - Includes **all basic profile fields** plus:
    - **Upcoming & past tagged events**.
    - **Musician details**:
      - **Genre**
      - **Instruments**
- **Organizer Profile**:
  - Includes **all basic profile fields** plus:
    - **Upcoming events created**.
    - **Past events created**.

### 🔧 **Profile Management**
- **Edit Profile**:
  - Fields:
    - **Full Name**
    - **Bio**
    - **Change Profile Image**
    - **Upgrade User Role** (only if the role is **Basic**).
    
**renders:** **Genre** and **Instruments** field for users with role of musician.

---  

## User Roles & Permissions

The system includes **three user roles** with unique permissions:

### 1. **"basic" (Default Role)**

✅ Can:

- Browse events.

- Follow other users.

- Comment on events.

❌ Cannot:

- Create or edit events.
- Be tagged in events
- Upgrade account more than once.
  
### 2. **"musician"**

✅ Can:

- Perform all actions of a **Basic User**.

- Be tagged in events by organisers.

- See a **list of past and upcoming events** they are performing at.

- Fill out **"Genre"** and **"Instruments"** fields on their profile.

❌ Cannot:

- Create or edit events.

### 3. **"organiser"**

✅ Can:

- Perform all actions of a **Basic User**.

- Create, edit, and delete events.

- Tag musicians in their events.

- View a **list of past and upcoming events** they have created.

  ❌ Cannot:

- Be tagged in events by organisers.
---

## Navigation Menu

The site will have a **navigation bar** that includes:
- **Logo**

- **Home**

- **Events**

- **Create Event** (Only for Organisers)

- **Logout** (if logged in) / **Sign in**, **Sign Up** (if logged out) 

- **Profile**  (if logged in)

---

## Potential Future Features

- **Event Booking System:** Users can RSVP for events.

- **Social Media Integration:** Share events on social platforms.

- **Live Chat for Events:** Attendees can chat in real time.

- **Event Ratings & Reviews:** Users can rate past events.

---

## The Skeleton Plane

### Wireframes

Wireframes were created to visualize the user interface before development.

---

## The Surface Plane

### Design

The application follows a **modern, sleek, and user-friendly design** with a focus on accessibility.

### Colour Scheme

A well-balanced **positive theme with vibrant accent colors** to enhance readability and engagement.

### Typography

Using **Google Fonts** for stylish yet readable text
---

## Technologies

- **Frontend:** HTML, CSS, JavaScript, React

- **Backend:** Django (connected via API)

- **Database:** PostgreSQL

- **Styling:** Bootstrap, CSS

- **Version Control:** Git, GitHub

- **Deployment:** Heroku

---

## Testing

### Test Case: Updating Profile with Musician Fields

**Title:**

Basic User Upgrading to Musician – Validate Inclusion of Musician Fields

**Objective:**

Verify that when a basic user changes their role to "musician" and submits the profile form with musician-specific fields (i.e., "genres" and "instruments"), the update is successful and the musician fields are stored and returned in the API response.

**Pre-requisites:**

- The user must be logged in as a basic user.

- The profile edit UI is accessible.

**Test Steps:**

1. **Log In as a user with role of "basic"**

- Log in to the application with a basic user account.

- Ensure that the user’s current role is "basic".

2. **Navigate to Profile Edit Page**

- Open the profile edit form where the user’s current information is loaded from the backend.

3. **Change Role to Musician**

- In the role selection dropdown, change the role from "basic" to "musician".

- *(Note: This field is enabled only for users with a "basic" role.)*

4. **Enter Musician-Specific Information**

- Fill in the musician-specific fields:

- **Genres:** e.g., "Rock, Jazz"

- **Instruments:** e.g., "Guitar, Piano"

5. **Submit the Form**

- Click the "Save" button to submit the updated profile information.

6. **Inspect the API Response**

- Using developer tools or an API client (like Postman), confirm that the API response includes the updated profile data.

- Check for the following:

- The **role** field is now set to "musician".

- The **genres** and **instruments** fields contain the values entered.

- The response includes all expected fields for a musician profile.

7. **Verify Backend**

- Refresh the profile view or perform a GET request on the profile endpoint to ensure that the musician fields are permanently stored and returned correctly.

**Expected Result:**

- The profile update should be successful.

- The returned profile data must include the role as "musician" and display the musician-specific fields (**genres** and **instruments**).

- The UI and API response should reflect the changes correctly.

### Actual Result (Before the Fix)

The old `get_serializer_class` method was implemented as follows:

```python
def get_serializer_class(self):
    """
    Return a serializer without musician-specific fields for non-musicians.
    """
    profile = self.get_object()
    if profile.role != 'musician':
        class NonMusicianProfileSerializer(ProfileSerializer):
            class Meta(ProfileSerializer.Meta):
                fields = [
                    field for field in ProfileSerializer.Meta.fields
                    if field not in ['genres', 'instruments']
                ]
        return NonMusicianProfileSerializer
    return ProfileSerializer
- **Issue**:
  This implementation only checked the profile’s current role (via self.get_object()) and did not consider the incoming update data.

  As a result, when a basic user attempted to change their role to "musician" along with filling in genres and instruments, the serializer used during the PUT request excluded those fields.

  Consequently, only the role changed while the musician-specific fields were omitted.

- **Solution Implemented**
I updated the get_serializer_class method to distinguish between PUT (update) requests and GET requests.
The new method first checks the incoming request data for PUT requests.

python
def get_serializer_class(self):
    # For edit/update requests, check the role in the incoming data.
    if self.request.method == 'PUT':
        if self.request.data.get('role') == 'musician':
            return ProfileSerializer
        else:
            # Otherwise, use a serializer without musician-specific fields.
            class NonMusicianProfileSerializer(ProfileSerializer):
                class Meta(ProfileSerializer.Meta):
                    fields = [
                        field for field in ProfileSerializer.Meta.fields
                        if field not in ['genres', 'instruments']
                    ]
            return NonMusicianProfileSerializer

    # For GET requests (and any other non-PUT requests), use the current profile role.
    profile = self.get_object()
    if profile.role != 'musician':
        class NonMusicianProfileSerializer(ProfileSerializer):
            class Meta(ProfileSerializer.Meta):
                fields = [
                    field for field in ProfileSerializer.Meta.fields
                    if field not in ['genres', 'instruments']
                ]
        return NonMusicianProfileSerializer

    return ProfileSerializer

The serializer now checks self.request.data for the role value.
If the incoming role is "musician", the full ProfileSerializer (which includes genres and instruments) is returned.
Otherwise, a modified serializer that excludes these fields is used.
For GET (and other) requests:

The current profile role (from self.get_object()) is used to determine which serializer to return.
Outcome
With the updated method:

When a basic user changes their role to "musician" and provides musician-specific information, the full serializer is used during the PUT request.
This ensures that the musician fields are included in both the response and the saved profile data.
Conclusion
After redeploying the backend with the updated get_serializer_class method, I re-ran the test.

✅ The profile now correctly updates the role to "musician" and includes the genres and instruments fields in the response.

✅ The updated musician information persists, confirming that the solution works as expected.

---

### Manual Test Case: Ensure Comments Are Unique to Their Event

**Objective:**

Verify that a comment created on one event is displayed **only** on that event and **not** on any other.

**Test Steps:**

1. **Create a Comment on Event A**

- Go to the detail page for Event A.

- Create a new comment.

- Confirm that the comment appears on Event A's page.

2. **Check a Different Event**

- Navigate to the detail page for Event B (or any event other than Event A).

- Verify that the comment from Event A is **not displayed** on Event B's page.

**Expected Result:**

- The comment should **only appear on Event A** and must **not** show up on Event B.

**Actual Result (Before Fix):**

- Comments were **not filtered by event**, meaning comments from Event A were also displayed on Event B.

**Solution Implemented:**

- The issue was resolved by integrating the **Django Filter Backend** into the Comments API, which now filters comments based on the event ID.

**Outcome:**

- After deploying the fix, comments are now correctly associated with their respective events, ensuring that they **do not appear on unrelated event pages**.

---

# Test Cases for Event Hub

Each test case follows this structure

- **Test ID:** Unique identifier for the test.

- **Description:** The purpose of the test.

- **Steps:** Step-by-step instructions to perform the test.

- **Expected Result:** What should happen if the feature works correctly.

- **Actual Result:** The outcome of the test.

- **Pass/Fail Status:** Whether the test was successful.

---

## Test Case: Ensure Event List Displays All Events

- **Test ID:** TC001

- **Description:** Ensure the event list page returns all events.

- **Steps:**

1. Navigate to **Event Hub**.

2. Go to the **Events** page.

3. Verify that all events are displayed in order of newest first.

- **Expected Result:** All events should be displayed in descending order by date (newest first).

- **Actual Result:** As expected.

- **Status:** ✅ **PASS**

---

## Test Case: Ensure Event Detail Page Opens on Click

- **Test ID:** TC002

- **Description:** Ensure that clicking on event "View Details" button, or the event image opens the event detail page.

- **Steps:**

1. Navigate to **Event Hub**.

2. Click on any event in the event list.

3. Verify that the event detail page loads with all fields displayed.

- **Expected Result:** The event detail page should open and display all relevant event information.

- **Actual Result:** As expected.

- **Status:** ✅ **PASS**

---

## Test Case: Ensure Only Organizers Can Create Events

- **Test ID:** TC003

- **Description:** Ensure that only users with the **organiser** role can create events.

- **Steps:**

1. Navigate to the **Create Event** page.

2. If the user is **not** an organiser, verify that the "Create Event" option is disabled.

3. If the user **is** an organiser, create a new event and submit it.

4. Verify that the event is added successfully.

- **Expected Result:** Only organisers should be able to create events.

- **Actual Result:** As expected.

- **Status:** ✅ **PASS**

---

## Test Case: Ensure Comments Stay Unique to Their Events

- **Test ID:** TC004

- **Description:** Ensure that a comment made on an event appears **only** on that event.

- **Steps:**

1. Navigate to **Event A**.

2. Add a comment.

3. Navigate to **Event B**.

4. Verify that the comment from **Event A** does **not** appear on **Event B**.

- **Expected Result:** Comments should only be displayed on the event they were posted on.

- **Actual Result:** As expected.

- **Status:** ✅ **PASS**

---

## Test Case: Ensure Basic Users Can Upgrade to Musician Role

- **Test ID:** TC005

- **Description:** Ensure that basic users can successfully upgrade to a musician profile.

- **Steps:**

1. Log in as a **basic user**.

2. Navigate to the **Edit Profile** page.

3. Change the role to **"musician"**.

4. Fill in musician-specific fields (**Genres** and **Instruments**).

5. Submit the form.

6. Check the API response and profile page.

- **Expected Result:** The user’s profile should update with the new role and musician-specific fields.

- **Actual Result:** As expected.

- **Status:** ✅ **PASS**

---

## Test Case: Ensure Only One Role Upgrade is Allowed

- **Test ID:** TC006

- **Description:** Ensure that users can only upgrade their account **once**.

- **Steps:**

1. Log in as a **basic user**.

2. Upgrade to **musician**.

3. Try to upgrade again to **organiser**.

4. Verify that the upgrade option is no longer available.

- **Expected Result:** Users should be able to upgrade **only once**.

- **Actual Result:** As expected.

- **Status:** ✅ **PASS**

---

## Test Case: Ensure Musicians Can See Their Tagged Events

- **Test ID:** TC007

- **Description:** Ensure that musicians can see a list of events they have been tagged in.

- **Steps:**

1. Log in as a **musician**.

2. Navigate to the **Profile Page**.

3. Verify that the **Upcoming Events** and **Past Events** sections list the correct events.

- **Expected Result:** The musician’s profile should display events they have been tagged in.

- **Actual Result:** As expected.

- **Status:** ✅ **PASS**

---

## Test Case: Ensure Event Organisers Can Tag Musicians

- **Test ID:** TC008

- **Description:** Ensure that event organisers can tag musicians in their events.

- **Steps:**

1. Log in as an **organiser**.

2. Navigate to **Create/Edit Event**.

3. Use the musician selection field to tag musicians.

4. Save the event.

5. Verify that the musician is correctly listed in the event details.

- **Expected Result:** The event should display the tagged musician(s).

- **Actual Result:** As expected.

- **Status:** ✅ **PASS**

---

## Test Case: Ensure Profile Page Displays Correct Role Information

- **Test ID:** TC009

- **Description:** Ensure that user profiles correctly display their role (Basic, Musician, Organiser).

- **Steps:**

1. Log in as any user.

2. Navigate to the **Profile Page**.

3. Verify that the role is displayed correctly.

- **Expected Result:** The profile page should show the correct user role.

- **Actual Result:** As expected.

- **Status:** ✅ **PASS**

## Deployment

### Heroku Deployment

1. Ensure you have a **Heroku account** and the CLI installed.

2. Run:

```sh

heroku create project-name

git push heroku main