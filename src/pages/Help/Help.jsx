import Sidebar from "../../components/sidebar/sidebar";
import { HelpCircle, Mail, Book, MessageSquare, ExternalLink } from "lucide-react";
import "./Help.css";

export default function Help() {
  const faqs = [
    {
      question: "How do I create a new task?",
      answer: "Navigate to 'My Tasks' page and click the 'Add Task' button. Fill in the task details including title, description, priority, and due date."
    },
    {
      question: "How can I organize tasks into projects?",
      answer: "First, create a project in the 'Projects' page. Then, when creating or editing a task, you can assign it to any of your existing projects."
    },
    {
      question: "How do I mark a task as complete?",
      answer: "In the 'My Tasks' page, click the circle icon next to any task to toggle its completion status. Completed tasks will be shown with a strikethrough."
    },
    {
      question: "Can I view my tasks on a calendar?",
      answer: "Yes! Navigate to the 'Calendar' page to see all your tasks with due dates displayed on their respective dates."
    },
    {
      question: "How do I delete a task or project?",
      answer: "Click the trash icon on any task card or project card to delete it. Note that deleting a project won't delete its associated tasks."
    },
    {
      question: "What do the priority levels mean?",
      answer: "Tasks can be marked as Low, Medium, or High priority. This helps you identify which tasks need immediate attention. High priority tasks are shown in red."
    }
  ];

  return (
    <div className="help-page">
      <Sidebar />
      <div className="help-content">
        <div className="help-header">
          <div>
            <h1 className="page-title">Help & Support</h1>
            <p className="page-subtitle">Find answers to common questions</p>
          </div>
        </div>

        <div className="help-cards">
          <div className="help-card">
            <div className="help-card-icon book">
              <Book size={24} />
            </div>
            <h3>Documentation</h3>
            <p>Browse our comprehensive guides and tutorials</p>
            <button className="help-card-btn">View Docs</button>
          </div>

          <div className="help-card">
            <div className="help-card-icon message">
              <MessageSquare size={24} />
            </div>
            <h3>Community</h3>
            <p>Connect with other users and share tips</p>
            <button className="help-card-btn">Join Community</button>
          </div>

          <div className="help-card">
            <div className="help-card-icon mail">
              <Mail size={24} />
            </div>
            <h3>Contact Support</h3>
            <p>Get help from our support team</p>
            <button className="help-card-btn">Contact Us</button>
          </div>
        </div>

        <div className="faq-section">
          <h2 className="section-title">
            <HelpCircle size={24} />
            Frequently Asked Questions
          </h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="support-section">
          <h2 className="section-title">Still need help?</h2>
          <p className="support-text">
            Our support team is here to assist you with any questions or issues you may have.
          </p>
          <button className="contact-support-btn">
            <Mail size={18} />
            Contact Support Team
          </button>
        </div>
      </div>
    </div>
  );
}
