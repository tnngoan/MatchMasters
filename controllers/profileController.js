import Profile from "../models/Profile.js";

// @desc    Get all profiles
// @route   GET /api/profiles
// @access  Public
const getProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find({});
    res.json(profiles);
  } catch (error) {
    console.error('Error in getProfiles controller:', error);
    res.status(500);
    next(new Error('Server Error: Failed to fetch profiles'));
  }
};

// @desc    Get profile by ID
// @route   GET /api/profiles/:id
// @access  Public
const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    
    if (profile) {
      res.json(profile);
    } else {
      res.status(404);
      throw new Error('Profile not found');
    }
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

// @desc    Create a profile
// @route   POST /api/profiles
// @access  Private
const createProfile = async (req, res) => {
  try {
    const profile = new Profile({
      userId: req.user._id,
      name: req.body.name,
      sports: req.body.sports,
      certifications: req.body.certifications,
      experience: req.body.experience,
      hourlyRate: req.body.hourlyRate,
      availability: req.body.availability,
      bio: req.body.bio,
      contactInfo: req.body.contactInfo
    });

    const createdProfile = await profile.save();
    res.status(201).json(createdProfile);
  } catch (error) {
    res.status(400);
    throw new Error('Invalid profile data');
  }
};

// @desc    Update a profile
// @route   PUT /api/profiles/:id
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    
    if (!profile) {
      res.status(404);
      throw new Error('Profile not found');
    }
    
    // Check if the user is the owner of the profile
    if (profile.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this profile');
    }
    
    // Update fields
    profile.name = req.body.name || profile.name;
    profile.sports = req.body.sports || profile.sports;
    profile.certifications = req.body.certifications || profile.certifications;
    profile.experience = req.body.experience || profile.experience;
    profile.hourlyRate = req.body.hourlyRate || profile.hourlyRate;
    profile.availability = req.body.availability || profile.availability;
    profile.bio = req.body.bio || profile.bio;
    profile.contactInfo = req.body.contactInfo || profile.contactInfo;
    
    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(res.statusCode === 200 ? 400 : res.statusCode);
    throw new Error(error.message);
  }
};

export { getProfiles, getProfileById, createProfile, updateProfile };