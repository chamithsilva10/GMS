// Demo data setup script for NCAS Grant Management System
// Run this in the browser console or as a Node.js script

function setupDemoData() {
  // Clear existing data
  localStorage.removeItem("ncas_users")
  localStorage.removeItem("ncas_grants")
  localStorage.removeItem("ncas_current_user")
  localStorage.removeItem("ncas_audit_logs")

  // Create demo users with correct credentials
  const demoUsers = [
    {
      id: "1",
      firstName: "System",
      lastName: "Administrator",
      email: "admin@ncas.org",
      password: "admin123", // Plain text for demo - in production would be hashed
      role: "admin",
      organization: "NCAS",
      phone: "+1-555-0001",
      status: "approved",
      createdAt: new Date().toISOString(),
      mfaEnabled: true,
    },
    {
      id: "2",
      firstName: "Grant",
      lastName: "Manager",
      email: "manager@ncas.org",
      password: "manager123",
      role: "grant_manager",
      organization: "NCAS",
      phone: "+1-555-0002",
      status: "approved",
      createdAt: new Date().toISOString(),
      mfaEnabled: true,
    },
    {
      id: "3",
      firstName: "John",
      lastName: "Applicant",
      email: "applicant@ncas.org",
      password: "applicant123",
      role: "applicant",
      organization: "Demo University",
      phone: "+1-555-0003",
      status: "approved",
      createdAt: new Date().toISOString(),
      mfaEnabled: false,
    },
    {
      id: "4",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@research.org",
      password: "password123",
      role: "applicant",
      organization: "Research Institute",
      phone: "+1-555-0004",
      status: "pending",
      createdAt: new Date().toISOString(),
      mfaEnabled: false,
    },
    {
      id: "5",
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@tech.com",
      password: "password123",
      role: "grant_manager",
      organization: "Tech Solutions",
      phone: "+1-555-0005",
      status: "pending",
      createdAt: new Date().toISOString(),
      mfaEnabled: false,
    },
  ]

  // Create demo grant applications
  const demoGrants = [
    {
      id: "1",
      applicantId: "3",
      applicantName: "John Applicant",
      applicantEmail: "applicant@ncas.org",
      organization: "Demo University",
      title: "AI-Powered Healthcare Diagnostics",
      category: "healthcare",
      amount: 250000,
      duration: "2-years",
      description:
        "Development of an AI system for early disease detection using medical imaging. This project aims to revolutionize healthcare diagnostics by leveraging cutting-edge artificial intelligence technologies.",
      objectives:
        "1. Create accurate diagnostic tools\n2. Reduce healthcare costs\n3. Improve patient outcomes\n4. Develop scalable AI solutions",
      methodology:
        "We will use machine learning algorithms, conduct clinical trials, and perform comprehensive data analysis to achieve our objectives.",
      budget: "Personnel: $150,000\nEquipment: $75,000\nMaterials: $25,000\nOverhead: $25,000",
      timeline: "Year 1: Development and testing phase\nYear 2: Clinical trials and validation",
      impact: "Expected to improve diagnostic accuracy by 30% and reduce healthcare costs by 20%",
      sustainability:
        "Licensing to healthcare providers and ongoing maintenance contracts will ensure long-term sustainability",
      status: "pending",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      applicantId: "3",
      applicantName: "John Applicant",
      applicantEmail: "applicant@ncas.org",
      organization: "Demo University",
      title: "Sustainable Energy Storage Solutions",
      category: "environment",
      amount: 180000,
      duration: "18-months",
      description:
        "Research into next-generation battery technology for renewable energy storage. This project focuses on developing efficient and environmentally friendly energy storage systems.",
      objectives:
        "1. Develop efficient storage systems\n2. Reduce environmental impact\n3. Scale renewable energy adoption\n4. Create cost-effective solutions",
      methodology:
        "Materials science research, prototype development, and comprehensive performance testing will be conducted.",
      budget: "Personnel: $100,000\nMaterials: $50,000\nEquipment: $30,000",
      timeline: "Months 1-6: Research phase\nMonths 7-12: Development phase\nMonths 13-18: Testing and validation",
      impact: "Increase energy storage efficiency by 40% and significantly reduce carbon footprint",
      sustainability: "Technology transfer to industry partners and patent licensing for long-term impact",
      status: "approved",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
    {
      id: "3",
      applicantId: "3",
      applicantName: "John Applicant",
      applicantEmail: "applicant@ncas.org",
      organization: "Demo University",
      title: "Educational Technology Innovation",
      category: "education",
      amount: 95000,
      duration: "1-year",
      description:
        "Development of innovative educational technology solutions to enhance remote learning experiences and improve student engagement.",
      objectives:
        "1. Enhance remote learning\n2. Improve student engagement\n3. Develop scalable solutions\n4. Support diverse learning styles",
      methodology:
        "User-centered design, iterative development, and comprehensive testing with educational institutions.",
      budget: "Personnel: $60,000\nTechnology: $25,000\nTesting: $10,000",
      timeline: "Months 1-3: Design and planning\nMonths 4-9: Development\nMonths 10-12: Testing and deployment",
      impact: "Expected to improve student engagement by 50% and learning outcomes by 25%",
      sustainability: "Subscription model and partnerships with educational institutions",
      status: "rejected",
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    },
  ]

  // Initialize audit logs array
  const auditLogs = []

  // Save to localStorage
  localStorage.setItem("ncas_users", JSON.stringify(demoUsers))
  localStorage.setItem("ncas_grants", JSON.stringify(demoGrants))
  localStorage.setItem("ncas_audit_logs", JSON.stringify(auditLogs))

  console.log("✅ Demo data has been set up successfully!")
  console.log("📋 Available login credentials:")
  console.log("👨‍💼 Admin: admin@ncas.org / admin123")
  console.log("👩‍💼 Grant Manager: manager@ncas.org / manager123")
  console.log("👨‍🎓 Applicant: applicant@ncas.org / applicant123")
  console.log("⏳ Pending Users: jane.smith@research.org, mike.johnson@tech.com (password123)")
  console.log("")
  console.log("🔐 Note: Admin and Manager accounts require MFA (use code: 123456)")

  return {
    users: demoUsers,
    grants: demoGrants,
    message: "Demo data setup complete!",
  }
}

// Auto-run if in browser environment
if (typeof window !== "undefined") {
  setupDemoData()
}

// Export for Node.js environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = { setupDemoData }
}
