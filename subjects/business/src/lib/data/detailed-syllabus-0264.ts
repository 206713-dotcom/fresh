/**
 * Cambridge IGCSE Business (0264 / 0450) Complete Granular Syllabus Breakdown
 * 100% authentic to the official Cambridge International Examinations Syllabus.
 * Contains every Section, Topic, Subtopic (e.g. 1.2.1 Types of economic sector),
 * and granular learning points.
 */

export interface SyllabusBulletPoint {
  id: string; // e.g. "1.2.1-pt-1"
  subtopicCode: string; // e.g. "1.2.1"
  topicCode: string; // e.g. "1.2"
  sectionCode: string; // e.g. "1"
  text: string;
}

export interface DetailedSubtopic {
  code: string; // e.g. "1.2.1"
  title: string; // e.g. "Types of economic sector"
  topicCode: string; // e.g. "1.2"
  sectionCode: string; // e.g. "1"
  bulletPoints: SyllabusBulletPoint[];
}

export interface DetailedTopic {
  code: string; // e.g. "1.2"
  title: string; // e.g. "Economic sectors"
  sectionCode: string; // e.g. "1"
  subtopics: DetailedSubtopic[];
}

export interface DetailedSection {
  code: string; // e.g. "1"
  title: string; // e.g. "1. Understanding business activity"
  topics: DetailedTopic[];
}

export const DETAILED_0264_SYLLABUS: DetailedSection[] = [
  {
    "code": "1",
    "title": "1. Understanding business activity",
    "topics": [
      {
        "code": "1.1",
        "title": "Business activity",
        "subtopics": [
          {
            "code": "1.1.1",
            "title": "The nature of business activity",
            "sectionCode": "1",
            "topicCode": "1.1",
            "bulletPoints": [
              {
                "id": "1.1.1-pt-1",
                "subtopicCode": "1.1.1",
                "topicCode": "1.1",
                "sectionCode": "1",
                "text": "factors of production: land, labour, capital and enterprise"
              },
              {
                "id": "1.1.1-pt-2",
                "subtopicCode": "1.1.1",
                "topicCode": "1.1",
                "sectionCode": "1",
                "text": "concept of adding value and how added value can be increased"
              },
              {
                "id": "1.1.1-pt-3",
                "subtopicCode": "1.1.1",
                "topicCode": "1.1",
                "sectionCode": "1",
                "text": "concept of opportunity cost"
              }
            ]
          }
        ],
        "sectionCode": "1"
      },
      {
        "code": "1.2",
        "title": "Economic sectors",
        "subtopics": [
          {
            "code": "1.2.1",
            "title": "Types of economic sector",
            "sectionCode": "1",
            "topicCode": "1.2",
            "bulletPoints": [
              {
                "id": "1.2.1-pt-1",
                "subtopicCode": "1.2.1",
                "topicCode": "1.2",
                "sectionCode": "1",
                "text": "primary, secondary and tertiary sectors"
              },
              {
                "id": "1.2.1-pt-2",
                "subtopicCode": "1.2.1",
                "topicCode": "1.2",
                "sectionCode": "1",
                "text": "private and public sectors"
              }
            ]
          }
        ],
        "sectionCode": "1"
      },
      {
        "code": "1.3",
        "title": "Enterprise, business growth and size",
        "subtopics": [
          {
            "code": "1.3.1",
            "title": "Enterprise and entrepreneurship",
            "sectionCode": "1",
            "topicCode": "1.3",
            "bulletPoints": [
              {
                "id": "1.3.1-pt-1",
                "subtopicCode": "1.3.1",
                "topicCode": "1.3",
                "sectionCode": "1",
                "text": "characteristics of successful entrepreneurs"
              },
              {
                "id": "1.3.1-pt-2",
                "subtopicCode": "1.3.1",
                "topicCode": "1.3",
                "sectionCode": "1",
                "text": "purpose and key elements of a business plan: overview/summary, objectives, resources, market research, marketing, finance, people, operations"
              },
              {
                "id": "1.3.1-pt-3",
                "subtopicCode": "1.3.1",
                "topicCode": "1.3",
                "sectionCode": "1",
                "text": "the importance of having a business plan"
              },
              {
                "id": "1.3.1-pt-4",
                "subtopicCode": "1.3.1",
                "topicCode": "1.3",
                "sectionCode": "1",
                "text": "why governments support business start-ups"
              },
              {
                "id": "1.3.1-pt-5",
                "subtopicCode": "1.3.1",
                "topicCode": "1.3",
                "sectionCode": "1",
                "text": "how governments support business start-ups, e.g. grants, advice, low-cost loans, training schemes"
              }
            ]
          },
          {
            "code": "1.3.2",
            "title": "The methods and problems of measuring business size",
            "sectionCode": "1",
            "topicCode": "1.3",
            "bulletPoints": [
              {
                "id": "1.3.2-pt-1",
                "subtopicCode": "1.3.2",
                "topicCode": "1.3",
                "sectionCode": "1",
                "text": "methods of measuring business size, e.g. number of people employed, value of output/sales, volume of output/sales, capital employed (profit is not a method of measuring business size)"
              },
              {
                "id": "1.3.2-pt-2",
                "subtopicCode": "1.3.2",
                "topicCode": "1.3",
                "sectionCode": "1",
                "text": "problems when measuring business size"
              }
            ]
          },
          {
            "code": "1.3.3",
            "title": "Why some businesses grow and others remain small",
            "sectionCode": "1",
            "topicCode": "1.3",
            "bulletPoints": [
              {
                "id": "1.3.3-pt-1",
                "subtopicCode": "1.3.3",
                "topicCode": "1.3",
                "sectionCode": "1",
                "text": "why the owners of a business may want to grow the business"
              },
              {
                "id": "1.3.3-pt-2",
                "subtopicCode": "1.3.3",
                "topicCode": "1.3",
                "sectionCode": "1",
                "text": "how and why businesses can grow internally, e.g. develop new products, develop new markets"
              },
              {
                "id": "1.3.3-pt-3",
                "subtopicCode": "1.3.3",
                "topicCode": "1.3",
                "sectionCode": "1",
                "text": "how and why businesses can grow externally: mergers and takeovers, including horizontal"
              },
              {
                "id": "1.3.3-pt-4",
                "subtopicCode": "1.3.3",
                "topicCode": "1.3",
                "sectionCode": "1",
                "text": "integration, vertical integration"
              },
              {
                "id": "1.3.3-pt-5",
                "subtopicCode": "1.3.3",
                "topicCode": "1.3",
                "sectionCode": "1",
                "text": "advantages and disadvantages of methods of growth problems linked to business growth why some businesses remain small"
              }
            ]
          },
          {
            "code": "1.3.4",
            "title": "Why some businesses succeed and others fail",
            "sectionCode": "1",
            "topicCode": "1.3",
            "bulletPoints": [
              {
                "id": "1.3.4-pt-1",
                "subtopicCode": "1.3.4",
                "topicCode": "1.3",
                "sectionCode": "1",
                "text": "reasons why businesses succeed or fail, e.g. management skills, availability of finance, suitability"
              },
              {
                "id": "1.3.4-pt-2",
                "subtopicCode": "1.3.4",
                "topicCode": "1.3",
                "sectionCode": "1",
                "text": "of product, demand for products, changes in the economy, level of competition"
              }
            ]
          }
        ],
        "sectionCode": "1"
      },
      {
        "code": "1.4",
        "title": "Types of business organisation",
        "subtopics": [
          {
            "code": "1.4.1",
            "title": "Different types of business organisation",
            "sectionCode": "1",
            "topicCode": "1.4",
            "bulletPoints": [
              {
                "id": "1.4.1-pt-1",
                "subtopicCode": "1.4.1",
                "topicCode": "1.4",
                "sectionCode": "1",
                "text": "sole traders, partnerships, private limited companies and public limited companies"
              },
              {
                "id": "1.4.1-pt-2",
                "subtopicCode": "1.4.1",
                "topicCode": "1.4",
                "sectionCode": "1",
                "text": "advantages and disadvantages of different types of business organisation"
              },
              {
                "id": "1.4.1-pt-3",
                "subtopicCode": "1.4.1",
                "topicCode": "1.4",
                "sectionCode": "1",
                "text": "recommend and justify a suitable type of business organisation to owners/management for a given situation"
              },
              {
                "id": "1.4.1-pt-4",
                "subtopicCode": "1.4.1",
                "topicCode": "1.4",
                "sectionCode": "1",
                "text": "different forms of business organisation: franchises, joint ventures, social enterprises"
              },
              {
                "id": "1.4.1-pt-5",
                "subtopicCode": "1.4.1",
                "topicCode": "1.4",
                "sectionCode": "1",
                "text": "advantages and disadvantages of franchises for the franchisor and franchisee"
              },
              {
                "id": "1.4.1-pt-6",
                "subtopicCode": "1.4.1",
                "topicCode": "1.4",
                "sectionCode": "1",
                "text": "advantages and disadvantages of joint ventures"
              }
            ]
          }
        ],
        "sectionCode": "1"
      },
      {
        "code": "1.5",
        "title": "Business objectives and stakeholder objectives",
        "subtopics": [
          {
            "code": "1.5.1",
            "title": "Business objectives",
            "sectionCode": "1",
            "topicCode": "1.5",
            "bulletPoints": [
              {
                "id": "1.5.1-pt-1",
                "subtopicCode": "1.5.1",
                "topicCode": "1.5",
                "sectionCode": "1",
                "text": "businesses can have several objectives, e.g. survival, growth, profit, market share"
              },
              {
                "id": "1.5.1-pt-2",
                "subtopicCode": "1.5.1",
                "topicCode": "1.5",
                "sectionCode": "1",
                "text": "the importance of business objectives"
              }
            ]
          },
          {
            "code": "1.5.2",
            "title": "The role of stakeholder groups",
            "sectionCode": "1",
            "topicCode": "1.5",
            "bulletPoints": [
              {
                "id": "1.5.2-pt-1",
                "subtopicCode": "1.5.2",
                "topicCode": "1.5",
                "sectionCode": "1",
                "text": "internal stakeholder groups: owners (sole traders, partnerships, shareholders, managers, employees"
              },
              {
                "id": "1.5.2-pt-2",
                "subtopicCode": "1.5.2",
                "topicCode": "1.5",
                "sectionCode": "1",
                "text": "external stakeholder groups: customers, suppliers, lenders/banks, government, local community"
              },
              {
                "id": "1.5.2-pt-3",
                "subtopicCode": "1.5.2",
                "topicCode": "1.5",
                "sectionCode": "1",
                "text": "objectives of different stakeholder groups"
              },
              {
                "id": "1.5.2-pt-4",
                "subtopicCode": "1.5.2",
                "topicCode": "1.5",
                "sectionCode": "1",
                "text": "how these objectives may conflict with each other"
              },
              {
                "id": "1.5.2-pt-5",
                "subtopicCode": "1.5.2",
                "topicCode": "1.5",
                "sectionCode": "1",
                "text": "employment contracts and legal controls, and training. How businesses are organised, managed and"
              },
              {
                "id": "1.5.2-pt-6",
                "subtopicCode": "1.5.2",
                "topicCode": "1.5",
                "sectionCode": "1",
                "text": "leadership styles are considered as well as the reasons why reducing a workforce may be necessary. Also"
              },
              {
                "id": "1.5.2-pt-7",
                "subtopicCode": "1.5.2",
                "topicCode": "1.5",
                "sectionCode": "1",
                "text": "included are methods of communication and examples of communication barriers in business. Finally, this"
              },
              {
                "id": "1.5.2-pt-8",
                "subtopicCode": "1.5.2",
                "topicCode": "1.5",
                "sectionCode": "1",
                "text": "topic covers the importance of having a well-motivated workforce and methods of motivation."
              }
            ]
          }
        ],
        "sectionCode": "1"
      }
    ]
  },
  {
    "code": "2",
    "title": "2. People in business",
    "topics": [
      {
        "code": "2.1",
        "title": "Human resource management (HRM)",
        "subtopics": [
          {
            "code": "2.1.1",
            "title": "Recruiting and selecting employees",
            "sectionCode": "2",
            "topicCode": "2.1",
            "bulletPoints": [
              {
                "id": "2.1.1-pt-1",
                "subtopicCode": "2.1.1",
                "topicCode": "2.1",
                "sectionCode": "2",
                "text": "stages in the recruitment process: job descriptions, person specifications, job advertisements"
              },
              {
                "id": "2.1.1-pt-2",
                "subtopicCode": "2.1.1",
                "topicCode": "2.1",
                "sectionCode": "2",
                "text": "(including employment agencies and online recruitment)"
              },
              {
                "id": "2.1.1-pt-3",
                "subtopicCode": "2.1.1",
                "topicCode": "2.1",
                "sectionCode": "2",
                "text": "selection methods, e.g. curriculum vitae (CV/resum\u00e9, application forms, references, testing/assessment centres, interviews"
              },
              {
                "id": "2.1.1-pt-4",
                "subtopicCode": "2.1.1",
                "topicCode": "2.1",
                "sectionCode": "2",
                "text": "advantages and disadvantages of internal and external recruitment"
              },
              {
                "id": "2.1.1-pt-5",
                "subtopicCode": "2.1.1",
                "topicCode": "2.1",
                "sectionCode": "2",
                "text": "recommend and justify who to employ in a given situation"
              }
            ]
          },
          {
            "code": "2.1.2",
            "title": "Employment contracts and legal controls over employment issues",
            "sectionCode": "2",
            "topicCode": "2.1",
            "bulletPoints": [
              {
                "id": "2.1.2-pt-1",
                "subtopicCode": "2.1.2",
                "topicCode": "2.1",
                "sectionCode": "2",
                "text": "the main contents of an employment contract: duties and responsibilities, working hours, holiday, entitlement, sick pay"
              },
              {
                "id": "2.1.2-pt-2",
                "subtopicCode": "2.1.2",
                "topicCode": "2.1",
                "sectionCode": "2",
                "text": "the benefits of employment contracts for employers and employees"
              },
              {
                "id": "2.1.2-pt-3",
                "subtopicCode": "2.1.2",
                "topicCode": "2.1",
                "sectionCode": "2",
                "text": "legal controls over employment issues: unfair dismissal, discrimination, health and safety, legal, minimum wage"
              },
              {
                "id": "2.1.2-pt-4",
                "subtopicCode": "2.1.2",
                "topicCode": "2.1",
                "sectionCode": "2",
                "text": "effects of legal controls over employment issues on employers and employees"
              }
            ]
          },
          {
            "code": "2.1.3",
            "title": "Training",
            "sectionCode": "2",
            "topicCode": "2.1",
            "bulletPoints": [
              {
                "id": "2.1.3-pt-1",
                "subtopicCode": "2.1.3",
                "topicCode": "2.1",
                "sectionCode": "2",
                "text": "importance of training to a business and to employees"
              },
              {
                "id": "2.1.3-pt-2",
                "subtopicCode": "2.1.3",
                "topicCode": "2.1",
                "sectionCode": "2",
                "text": "types of training: induction training, on-the-job training and off-the-job training"
              },
              {
                "id": "2.1.3-pt-3",
                "subtopicCode": "2.1.3",
                "topicCode": "2.1",
                "sectionCode": "2",
                "text": "advantages and disadvantages of the three types of training"
              }
            ]
          }
        ],
        "sectionCode": "2"
      },
      {
        "code": "2.2",
        "title": "Organisation and management",
        "subtopics": [
          {
            "code": "2.2.1",
            "title": "Simple organisational structures",
            "sectionCode": "2",
            "topicCode": "2.2",
            "bulletPoints": [
              {
                "id": "2.2.1-pt-1",
                "subtopicCode": "2.2.1",
                "topicCode": "2.2",
                "sectionCode": "2",
                "text": "the main functional areas of a business, e.g. operations, marketing, finance, human resources"
              },
              {
                "id": "2.2.1-pt-2",
                "subtopicCode": "2.2.1",
                "topicCode": "2.2",
                "sectionCode": "2",
                "text": "simple hierarchical structures: tall and flat levels of hierarchy, long and short chains of command, wide and narrow spans of control"
              },
              {
                "id": "2.2.1-pt-3",
                "subtopicCode": "2.2.1",
                "topicCode": "2.2",
                "sectionCode": "2",
                "text": "interpret simple organisational charts"
              },
              {
                "id": "2.2.1-pt-4",
                "subtopicCode": "2.2.1",
                "topicCode": "2.2",
                "sectionCode": "2",
                "text": "different ways of flexible working, e.g. home working and flexible hours"
              },
              {
                "id": "2.2.1-pt-5",
                "subtopicCode": "2.2.1",
                "topicCode": "2.2",
                "sectionCode": "2",
                "text": "advantages and disadvantages of part-time employees and full-time employees"
              }
            ]
          },
          {
            "code": "2.2.2",
            "title": "The functions of management",
            "sectionCode": "2",
            "topicCode": "2.2",
            "bulletPoints": [
              {
                "id": "2.2.2-pt-1",
                "subtopicCode": "2.2.2",
                "topicCode": "2.2",
                "sectionCode": "2",
                "text": "planning, organising, coordinating, commanding and controlling"
              },
              {
                "id": "2.2.2-pt-2",
                "subtopicCode": "2.2.2",
                "topicCode": "2.2",
                "sectionCode": "2",
                "text": "advantages and disadvantages of delegation"
              }
            ]
          },
          {
            "code": "2.2.3",
            "title": "Leadership styles",
            "sectionCode": "2",
            "topicCode": "2.2",
            "bulletPoints": [
              {
                "id": "2.2.3-pt-1",
                "subtopicCode": "2.2.3",
                "topicCode": "2.2",
                "sectionCode": "2",
                "text": "the main leadership styles: autocratic, democratic and laissez-faire"
              },
              {
                "id": "2.2.3-pt-2",
                "subtopicCode": "2.2.3",
                "topicCode": "2.2",
                "sectionCode": "2",
                "text": "advantages and disadvantages of the main leadership styles"
              },
              {
                "id": "2.2.3-pt-3",
                "subtopicCode": "2.2.3",
                "topicCode": "2.2",
                "sectionCode": "2",
                "text": "recommend and justify an appropriate leadership style for a given situation"
              }
            ]
          },
          {
            "code": "2.2.4",
            "title": "Why reducing the size of the workforce may be necessary",
            "sectionCode": "2",
            "topicCode": "2.2",
            "bulletPoints": [
              {
                "id": "2.2.4-pt-1",
                "subtopicCode": "2.2.4",
                "topicCode": "2.2",
                "sectionCode": "2",
                "text": "concept of downsizing"
              },
              {
                "id": "2.2.4-pt-2",
                "subtopicCode": "2.2.4",
                "topicCode": "2.2",
                "sectionCode": "2",
                "text": "reasons for reducing the size of the workforce, e.g. automation, reduced demand for products, need to lower costs"
              },
              {
                "id": "2.2.4-pt-3",
                "subtopicCode": "2.2.4",
                "topicCode": "2.2",
                "sectionCode": "2",
                "text": "concept of redundancy"
              },
              {
                "id": "2.2.4-pt-4",
                "subtopicCode": "2.2.4",
                "topicCode": "2.2",
                "sectionCode": "2",
                "text": "recommend and justify which employee(so make redundant in a given situation"
              }
            ]
          },
          {
            "code": "2.2.5",
            "title": "The role of trade unions",
            "sectionCode": "2",
            "topicCode": "2.2",
            "bulletPoints": [
              {
                "id": "2.2.5-pt-1",
                "subtopicCode": "2.2.5",
                "topicCode": "2.2",
                "sectionCode": "2",
                "text": "what a trade union is"
              },
              {
                "id": "2.2.5-pt-2",
                "subtopicCode": "2.2.5",
                "topicCode": "2.2",
                "sectionCode": "2",
                "text": "benefits to employees of being a trade union member"
              }
            ]
          }
        ],
        "sectionCode": "2"
      },
      {
        "code": "2.3",
        "title": "Methods of communication",
        "subtopics": [
          {
            "code": "2.3.1",
            "title": "Why communication is important",
            "sectionCode": "2",
            "topicCode": "2.3",
            "bulletPoints": [
              {
                "id": "2.3.1-pt-1",
                "subtopicCode": "2.3.1",
                "topicCode": "2.3",
                "sectionCode": "2",
                "text": "why communication is important for a business"
              },
              {
                "id": "2.3.1-pt-2",
                "subtopicCode": "2.3.1",
                "topicCode": "2.3",
                "sectionCode": "2",
                "text": "methods of communication, e.g. meetings (face-to-face or virtual, email, text messages, social"
              },
              {
                "id": "2.3.1-pt-3",
                "subtopicCode": "2.3.1",
                "topicCode": "2.3",
                "sectionCode": "2",
                "text": "media, phone calls (including mobile calls, letters, posters and noticeboards"
              },
              {
                "id": "2.3.1-pt-4",
                "subtopicCode": "2.3.1",
                "topicCode": "2.3",
                "sectionCode": "2",
                "text": "advantages and disadvantages of different methods of communication"
              },
              {
                "id": "2.3.1-pt-5",
                "subtopicCode": "2.3.1",
                "topicCode": "2.3",
                "sectionCode": "2",
                "text": "internal and external communication"
              },
              {
                "id": "2.3.1-pt-6",
                "subtopicCode": "2.3.1",
                "topicCode": "2.3",
                "sectionCode": "2",
                "text": "recommend and justify which method of communication to use in a given situation"
              }
            ]
          },
          {
            "code": "2.3.2",
            "title": "Communication barriers",
            "sectionCode": "2",
            "topicCode": "2.3",
            "bulletPoints": [
              {
                "id": "2.3.2-pt-1",
                "subtopicCode": "2.3.2",
                "topicCode": "2.3",
                "sectionCode": "2",
                "text": "examples of communication barriers"
              },
              {
                "id": "2.3.2-pt-2",
                "subtopicCode": "2.3.2",
                "topicCode": "2.3",
                "sectionCode": "2",
                "text": "reasons for communication barriers"
              },
              {
                "id": "2.3.2-pt-3",
                "subtopicCode": "2.3.2",
                "topicCode": "2.3",
                "sectionCode": "2",
                "text": "problems caused by communication barriers"
              },
              {
                "id": "2.3.2-pt-4",
                "subtopicCode": "2.3.2",
                "topicCode": "2.3",
                "sectionCode": "2",
                "text": "how communication barriers can be reduced or removed"
              }
            ]
          }
        ],
        "sectionCode": "2"
      },
      {
        "code": "2.4",
        "title": "Motivating employees",
        "subtopics": [
          {
            "code": "2.4.1",
            "title": "The importance of a well-motivated workforce",
            "sectionCode": "2",
            "topicCode": "2.4",
            "bulletPoints": [
              {
                "id": "2.4.1-pt-1",
                "subtopicCode": "2.4.1",
                "topicCode": "2.4",
                "sectionCode": "2",
                "text": "why people work"
              },
              {
                "id": "2.4.1-pt-2",
                "subtopicCode": "2.4.1",
                "topicCode": "2.4",
                "sectionCode": "2",
                "text": "the benefits of a well-motivated workforce: improved labour productivity, reduced absenteeism, lower labour turnover and greater willingness to accept change"
              },
              {
                "id": "2.4.1-pt-3",
                "subtopicCode": "2.4.1",
                "topicCode": "2.4",
                "sectionCode": "2",
                "text": "new methods of working"
              },
              {
                "id": "2.4.1-pt-4",
                "subtopicCode": "2.4.1",
                "topicCode": "2.4",
                "sectionCode": "2",
                "text": "main motivational theories: Maslow, Taylor, Herzberg"
              }
            ]
          },
          {
            "code": "2.4.2",
            "title": "Methods of motivation",
            "sectionCode": "2",
            "topicCode": "2.4",
            "bulletPoints": [
              {
                "id": "2.4.2-pt-1",
                "subtopicCode": "2.4.2",
                "topicCode": "2.4",
                "sectionCode": "2",
                "text": "financial methods of motivation, e.g. time-based, piece-rate, salary, bonus, commission, profit, sharing, fringe benefits"
              },
              {
                "id": "2.4.2-pt-2",
                "subtopicCode": "2.4.2",
                "topicCode": "2.4",
                "sectionCode": "2",
                "text": "non-financial methods of motivation, e.g. job enrichment, job rotation, training, opportunities for"
              },
              {
                "id": "2.4.2-pt-3",
                "subtopicCode": "2.4.2",
                "topicCode": "2.4",
                "sectionCode": "2",
                "text": "promotion, praise, employee of the month"
              },
              {
                "id": "2.4.2-pt-4",
                "subtopicCode": "2.4.2",
                "topicCode": "2.4",
                "sectionCode": "2",
                "text": "recommend and justify an appropriate method of motivation for a given situation"
              },
              {
                "id": "2.4.2-pt-5",
                "subtopicCode": "2.4.2",
                "topicCode": "2.4",
                "sectionCode": "2",
                "text": "change and the use of market segmentation. Market research and the marketing mix, including the four"
              },
              {
                "id": "2.4.2-pt-6",
                "subtopicCode": "2.4.2",
                "topicCode": "2.4",
                "sectionCode": "2",
                "text": "Ps, are covered as is marketing strategy, including entering new markets in other countries. Examples of"
              },
              {
                "id": "2.4.2-pt-7",
                "subtopicCode": "2.4.2",
                "topicCode": "2.4",
                "sectionCode": "2",
                "text": "ecommerce and its advantages and disadvantages are considered as is the purpose of legal controls related"
              }
            ]
          }
        ],
        "sectionCode": "2"
      }
    ]
  },
  {
    "code": "3",
    "title": "3. Marketing",
    "topics": [
      {
        "code": "3.1",
        "title": "Marketing and the market",
        "subtopics": [
          {
            "code": "3.1.1",
            "title": "The role of marketing",
            "sectionCode": "3",
            "topicCode": "3.1",
            "bulletPoints": [
              {
                "id": "3.1.1-pt-1",
                "subtopicCode": "3.1.1",
                "topicCode": "3.1",
                "sectionCode": "3",
                "text": "identifying customer needs"
              },
              {
                "id": "3.1.1-pt-2",
                "subtopicCode": "3.1.1",
                "topicCode": "3.1",
                "sectionCode": "3",
                "text": "satisfying customer needs"
              },
              {
                "id": "3.1.1-pt-3",
                "subtopicCode": "3.1.1",
                "topicCode": "3.1",
                "sectionCode": "3",
                "text": "maintaining customer loyalty"
              },
              {
                "id": "3.1.1-pt-4",
                "subtopicCode": "3.1.1",
                "topicCode": "3.1",
                "sectionCode": "3",
                "text": "building customer relationships"
              },
              {
                "id": "3.1.1-pt-5",
                "subtopicCode": "3.1.1",
                "topicCode": "3.1",
                "sectionCode": "3",
                "text": "anticipating changes in customer needs"
              }
            ]
          },
          {
            "code": "3.1.2",
            "title": "Understanding market changes",
            "sectionCode": "3",
            "topicCode": "3.1",
            "bulletPoints": [
              {
                "id": "3.1.2-pt-1",
                "subtopicCode": "3.1.2",
                "topicCode": "3.1",
                "sectionCode": "3",
                "text": "why consumer spending patterns may change"
              },
              {
                "id": "3.1.2-pt-2",
                "subtopicCode": "3.1.2",
                "topicCode": "3.1",
                "sectionCode": "3",
                "text": "why some markets are becoming more competitive"
              },
              {
                "id": "3.1.2-pt-3",
                "subtopicCode": "3.1.2",
                "topicCode": "3.1",
                "sectionCode": "3",
                "text": "how businesses can respond to changing spending patterns and increased competition"
              },
              {
                "id": "3.1.2-pt-4",
                "subtopicCode": "3.1.2",
                "topicCode": "3.1",
                "sectionCode": "3",
                "text": "calculate market share"
              }
            ]
          },
          {
            "code": "3.1.3",
            "title": "Mass markets and niche markets",
            "sectionCode": "3",
            "topicCode": "3.1",
            "bulletPoints": [
              {
                "id": "3.1.3-pt-1",
                "subtopicCode": "3.1.3",
                "topicCode": "3.1",
                "sectionCode": "3",
                "text": "concepts of mass markets and niche markets"
              },
              {
                "id": "3.1.3-pt-2",
                "subtopicCode": "3.1.3",
                "topicCode": "3.1",
                "sectionCode": "3",
                "text": "advantages and disadvantages of mass markets and niche markets"
              }
            ]
          },
          {
            "code": "3.1.4",
            "title": "Market segmentation",
            "sectionCode": "3",
            "topicCode": "3.1",
            "bulletPoints": [
              {
                "id": "3.1.4-pt-1",
                "subtopicCode": "3.1.4",
                "topicCode": "3.1",
                "sectionCode": "3",
                "text": "how markets can be segmented according to: age, income, location, gender, lifestyle"
              },
              {
                "id": "3.1.4-pt-2",
                "subtopicCode": "3.1.4",
                "topicCode": "3.1",
                "sectionCode": "3",
                "text": "advantages and disadvantages of market segmentation"
              }
            ]
          }
        ],
        "sectionCode": "3"
      },
      {
        "code": "3.2",
        "title": "Market research",
        "subtopics": [
          {
            "code": "3.2.1",
            "title": "Methods of market research",
            "sectionCode": "3",
            "topicCode": "3.2",
            "bulletPoints": [
              {
                "id": "3.2.1-pt-1",
                "subtopicCode": "3.2.1",
                "topicCode": "3.2",
                "sectionCode": "3",
                "text": "why businesses use market research"
              },
              {
                "id": "3.2.1-pt-2",
                "subtopicCode": "3.2.1",
                "topicCode": "3.2",
                "sectionCode": "3",
                "text": "primary research methods, e.g. questionnaires or surveys, interviews, focus groups, observation"
              },
              {
                "id": "3.2.1-pt-3",
                "subtopicCode": "3.2.1",
                "topicCode": "3.2",
                "sectionCode": "3",
                "text": "the concept of sampling and why it is useful to businesses"
              },
              {
                "id": "3.2.1-pt-4",
                "subtopicCode": "3.2.1",
                "topicCode": "3.2",
                "sectionCode": "3",
                "text": "advantages and disadvantages of primary market research methods"
              },
              {
                "id": "3.2.1-pt-5",
                "subtopicCode": "3.2.1",
                "topicCode": "3.2",
                "sectionCode": "3",
                "text": "secondary research methods, e.g. competitor websites, government sources, market reports, trade magazines"
              },
              {
                "id": "3.2.1-pt-6",
                "subtopicCode": "3.2.1",
                "topicCode": "3.2",
                "sectionCode": "3",
                "text": "advantages and disadvantages of secondary market research methods"
              },
              {
                "id": "3.2.1-pt-7",
                "subtopicCode": "3.2.1",
                "topicCode": "3.2",
                "sectionCode": "3",
                "text": "factors influencing the accuracy of market research data"
              },
              {
                "id": "3.2.1-pt-8",
                "subtopicCode": "3.2.1",
                "topicCode": "3.2",
                "sectionCode": "3",
                "text": "analyse simple market research data"
              }
            ]
          }
        ],
        "sectionCode": "3"
      },
      {
        "code": "3.3",
        "title": "Marketing mix",
        "subtopics": [
          {
            "code": "3.3.1",
            "title": "Product",
            "sectionCode": "3",
            "topicCode": "3.3",
            "bulletPoints": [
              {
                "id": "3.3.1-pt-1",
                "subtopicCode": "3.3.1",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "the importance of brand image"
              },
              {
                "id": "3.3.1-pt-2",
                "subtopicCode": "3.3.1",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "the role of packaging"
              },
              {
                "id": "3.3.1-pt-3",
                "subtopicCode": "3.3.1",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "advantages and disadvantages of developing new products"
              },
              {
                "id": "3.3.1-pt-4",
                "subtopicCode": "3.3.1",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "the main stages of the product life cycle: introduction, growth, maturity, decline"
              },
              {
                "id": "3.3.1-pt-5",
                "subtopicCode": "3.3.1",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "interpret a product life cycle diagram"
              },
              {
                "id": "3.3.1-pt-6",
                "subtopicCode": "3.3.1",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "extension strategies a business could use: new markets, new uses for a product, adapting the"
              },
              {
                "id": "3.3.1-pt-7",
                "subtopicCode": "3.3.1",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "product or packaging, increased advertising"
              },
              {
                "id": "3.3.1-pt-8",
                "subtopicCode": "3.3.1",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "sales promotion"
              },
              {
                "id": "3.3.1-pt-9",
                "subtopicCode": "3.3.1",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "advantages and disadvantages of different extension strategies"
              },
              {
                "id": "3.3.1-pt-10",
                "subtopicCode": "3.3.1",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "recommend and justify an extension strategy to use in a given situation"
              }
            ]
          },
          {
            "code": "3.3.2",
            "title": "Price",
            "sectionCode": "3",
            "topicCode": "3.3",
            "bulletPoints": [
              {
                "id": "3.3.2-pt-1",
                "subtopicCode": "3.3.2",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "pricing methods: cost-plus, competitive, penetration, skimming, dynamic"
              },
              {
                "id": "3.3.2-pt-2",
                "subtopicCode": "3.3.2",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "advantages and disadvantages of different pricing methods"
              },
              {
                "id": "3.3.2-pt-3",
                "subtopicCode": "3.3.2",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "recommend and justify an appropriate pricing method for a given situation"
              }
            ]
          },
          {
            "code": "3.3.3",
            "title": "Place",
            "sectionCode": "3",
            "topicCode": "3.3",
            "bulletPoints": [
              {
                "id": "3.3.3-pt-1",
                "subtopicCode": "3.3.3",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "advantages and disadvantages of different distribution channels: direct to customers, through"
              },
              {
                "id": "3.3.3-pt-2",
                "subtopicCode": "3.3.3",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "retailers, wholesalers, agents"
              },
              {
                "id": "3.3.3-pt-3",
                "subtopicCode": "3.3.3",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "recommend and justify an appropriate distribution channel for a given situation"
              }
            ]
          },
          {
            "code": "3.3.4",
            "title": "Promotion",
            "sectionCode": "3",
            "topicCode": "3.3",
            "bulletPoints": [
              {
                "id": "3.3.4-pt-1",
                "subtopicCode": "3.3.4",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "reasons for promotion"
              },
              {
                "id": "3.3.4-pt-2",
                "subtopicCode": "3.3.4",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "methods of sales promotion, e.g. vouchers, reward schemes, competitions, special, offers, discounts"
              },
              {
                "id": "3.3.4-pt-3",
                "subtopicCode": "3.3.4",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "methods of advertising, e.g. social media, direct/targeted emails, leaflets, billboards"
              },
              {
                "id": "3.3.4-pt-4",
                "subtopicCode": "3.3.4",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "recommend and justify which method of sales promotion to use in a given situation"
              },
              {
                "id": "3.3.4-pt-5",
                "subtopicCode": "3.3.4",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "recommend and justify which method of advertising to use in a given situation"
              }
            ]
          },
          {
            "code": "3.3.5",
            "title": "Ecommerce",
            "sectionCode": "3",
            "topicCode": "3.3",
            "bulletPoints": [
              {
                "id": "3.3.5-pt-1",
                "subtopicCode": "3.3.5",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "examples of ecommerce, e.g. mobile phone"
              },
              {
                "id": "3.3.5-pt-2",
                "subtopicCode": "3.3.5",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "internet banking, online shopping, online ticketing"
              },
              {
                "id": "3.3.5-pt-3",
                "subtopicCode": "3.3.5",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "advantages and disadvantages of ecommerce for businesses"
              },
              {
                "id": "3.3.5-pt-4",
                "subtopicCode": "3.3.5",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "advantages and disadvantages of ecommerce for customers"
              }
            ]
          },
          {
            "code": "3.3.6",
            "title": "Marketing strategy",
            "sectionCode": "3",
            "topicCode": "3.3",
            "bulletPoints": [
              {
                "id": "3.3.6-pt-1",
                "subtopicCode": "3.3.6",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "importance of the different elements in the marketing mix"
              },
              {
                "id": "3.3.6-pt-2",
                "subtopicCode": "3.3.6",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "recommend and justify an appropriate marketing mix for a given situation"
              }
            ]
          },
          {
            "code": "3.3.7",
            "title": "Entering new markets in other countries as a method of growth",
            "sectionCode": "3",
            "topicCode": "3.3",
            "bulletPoints": [
              {
                "id": "3.3.7-pt-1",
                "subtopicCode": "3.3.7",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "advantages of entering new markets in other countries, e.g. increase sales, spread risk"
              },
              {
                "id": "3.3.7-pt-2",
                "subtopicCode": "3.3.7",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "disadvantages of entering new markets in other countries, e.g. cultural differences, lack of"
              },
              {
                "id": "3.3.7-pt-3",
                "subtopicCode": "3.3.7",
                "topicCode": "3.3",
                "sectionCode": "3",
                "text": "knowledge, legal requirements"
              }
            ]
          }
        ],
        "sectionCode": "3"
      },
      {
        "code": "3.4",
        "title": "Legal controls",
        "subtopics": [
          {
            "code": "3.4.1",
            "title": "Legal controls related to marketing",
            "sectionCode": "3",
            "topicCode": "3.4",
            "bulletPoints": [
              {
                "id": "3.4.1-pt-1",
                "subtopicCode": "3.4.1",
                "topicCode": "3.4",
                "sectionCode": "3",
                "text": "the purpose of legal controls to protect customers: misleading promotion, faulty goods"
              },
              {
                "id": "3.4.1-pt-2",
                "subtopicCode": "3.4.1",
                "topicCode": "3.4",
                "sectionCode": "3",
                "text": "the effects of legal controls on marketing"
              },
              {
                "id": "3.4.1-pt-3",
                "subtopicCode": "3.4.1",
                "topicCode": "3.4",
                "sectionCode": "3",
                "text": "the role of technology and the importance of sustainable production. Costs, the scale of production, as"
              },
              {
                "id": "3.4.1-pt-4",
                "subtopicCode": "3.4.1",
                "topicCode": "3.4",
                "sectionCode": "3",
                "text": "well as break-even analysis are included alongside economies of scale and quality production. This topic"
              },
              {
                "id": "3.4.1-pt-5",
                "subtopicCode": "3.4.1",
                "topicCode": "3.4",
                "sectionCode": "3",
                "text": "concludes with the main factors which influence location decisions."
              }
            ]
          }
        ],
        "sectionCode": "3"
      }
    ]
  },
  {
    "code": "4",
    "title": "4. Operations management",
    "topics": [
      {
        "code": "4.1",
        "title": "Production of goods and services",
        "subtopics": [
          {
            "code": "4.1.1",
            "title": "Production processes",
            "sectionCode": "4",
            "topicCode": "4.1",
            "bulletPoints": [
              {
                "id": "4.1.1-pt-1",
                "subtopicCode": "4.1.1",
                "topicCode": "4.1",
                "sectionCode": "4",
                "text": "calculate labour productivity"
              },
              {
                "id": "4.1.1-pt-2",
                "subtopicCode": "4.1.1",
                "topicCode": "4.1",
                "sectionCode": "4",
                "text": "why e034ciency is important for a business"
              },
              {
                "id": "4.1.1-pt-3",
                "subtopicCode": "4.1.1",
                "topicCode": "4.1",
                "sectionCode": "4",
                "text": "how to increase e034ciency, e.g. increasing automation and technology, improving labour skills"
              },
              {
                "id": "4.1.1-pt-4",
                "subtopicCode": "4.1.1",
                "topicCode": "4.1",
                "sectionCode": "4",
                "text": "concept of lean production and how to achieve it: just-in-time (JITnventory control and Kaizen"
              },
              {
                "id": "4.1.1-pt-5",
                "subtopicCode": "4.1.1",
                "topicCode": "4.1",
                "sectionCode": "4",
                "text": "advantages and disadvantages of lean production methods"
              },
              {
                "id": "4.1.1-pt-6",
                "subtopicCode": "4.1.1",
                "topicCode": "4.1",
                "sectionCode": "4",
                "text": "why businesses hold inventory"
              },
              {
                "id": "4.1.1-pt-7",
                "subtopicCode": "4.1.1",
                "topicCode": "4.1",
                "sectionCode": "4",
                "text": "factors affecting how much inventory businesses hold"
              }
            ]
          },
          {
            "code": "4.1.2",
            "title": "The main methods of production",
            "sectionCode": "4",
            "topicCode": "4.1",
            "bulletPoints": [
              {
                "id": "4.1.2-pt-1",
                "subtopicCode": "4.1.2",
                "topicCode": "4.1",
                "sectionCode": "4",
                "text": "job, batch and flow production"
              },
              {
                "id": "4.1.2-pt-2",
                "subtopicCode": "4.1.2",
                "topicCode": "4.1",
                "sectionCode": "4",
                "text": "advantages and disadvantages of job, batch and flow production"
              },
              {
                "id": "4.1.2-pt-3",
                "subtopicCode": "4.1.2",
                "topicCode": "4.1",
                "sectionCode": "4",
                "text": "recommend and justify an appropriate production method for a given situation"
              }
            ]
          }
        ],
        "sectionCode": "4"
      },
      {
        "code": "4.2",
        "title": "Technology and production of goods and services",
        "subtopics": [
          {
            "code": "4.2.1",
            "title": "The use of technology in the production of goods and services",
            "sectionCode": "4",
            "topicCode": "4.2",
            "bulletPoints": [
              {
                "id": "4.2.1-pt-1",
                "subtopicCode": "4.2.1",
                "topicCode": "4.2",
                "sectionCode": "4",
                "text": "how technology is changing production methods through automation and mechanisation, e.g. Computer-Aided Manufacture (CAM and 3D Printing"
              },
              {
                "id": "4.2.1-pt-2",
                "subtopicCode": "4.2.1",
                "topicCode": "4.2",
                "sectionCode": "4",
                "text": "how technology is improving productivity in the service sector, e.g. contactless payments"
              },
              {
                "id": "4.2.1-pt-3",
                "subtopicCode": "4.2.1",
                "topicCode": "4.2",
                "sectionCode": "4",
                "text": "advantages and disadvantages of changes in technology for businesses and employees"
              }
            ]
          }
        ],
        "sectionCode": "4"
      },
      {
        "code": "4.3",
        "title": "Sustainable production of goods and services",
        "subtopics": [
          {
            "code": "4.3.1",
            "title": "Methods of sustainable production of goods and services",
            "sectionCode": "4",
            "topicCode": "4.3",
            "bulletPoints": [
              {
                "id": "4.3.1-pt-1",
                "subtopicCode": "4.3.1",
                "topicCode": "4.3",
                "sectionCode": "4",
                "text": "how businesses can be more sustainable: using renewable energy, using fewer resources, less"
              },
              {
                "id": "4.3.1-pt-2",
                "subtopicCode": "4.3.1",
                "topicCode": "4.3",
                "sectionCode": "4",
                "text": "waste, reusing, recycling, developing environmentally friendly products, using environmentally, friendly packaging"
              },
              {
                "id": "4.3.1-pt-3",
                "subtopicCode": "4.3.1",
                "topicCode": "4.3",
                "sectionCode": "4",
                "text": "advantages and disadvantages of businesses becoming more sustainable"
              }
            ]
          }
        ],
        "sectionCode": "4"
      },
      {
        "code": "4.4",
        "title": "Costs, scale of production and break-even analysis",
        "subtopics": [
          {
            "code": "4.4.1",
            "title": "Identify and classify costs",
            "sectionCode": "4",
            "topicCode": "4.4",
            "bulletPoints": [
              {
                "id": "4.4.1-pt-1",
                "subtopicCode": "4.4.1",
                "topicCode": "4.4",
                "sectionCode": "4",
                "text": "classify and calculate costs using examples, e.g. fixed, variable, average and total"
              },
              {
                "id": "4.4.1-pt-2",
                "subtopicCode": "4.4.1",
                "topicCode": "4.4",
                "sectionCode": "4",
                "text": "use cost data to help make simple decisions, e.g. which product to produce, whether to continue"
              },
              {
                "id": "4.4.1-pt-3",
                "subtopicCode": "4.4.1",
                "topicCode": "4.4",
                "sectionCode": "4",
                "text": "or stop production, what price to set, help choose suppliers"
              }
            ]
          },
          {
            "code": "4.4.2",
            "title": "Economies and diseconomies of scale",
            "sectionCode": "4",
            "topicCode": "4.4",
            "bulletPoints": [
              {
                "id": "4.4.2-pt-1",
                "subtopicCode": "4.4.2",
                "topicCode": "4.4",
                "sectionCode": "4",
                "text": "concept of economies of scale: purchasing, marketing, financial, managerial, technical"
              },
              {
                "id": "4.4.2-pt-2",
                "subtopicCode": "4.4.2",
                "topicCode": "4.4",
                "sectionCode": "4",
                "text": "concept of diseconomies of scale: poor communication, lack of commitment or loyalty from"
              },
              {
                "id": "4.4.2-pt-3",
                "subtopicCode": "4.4.2",
                "topicCode": "4.4",
                "sectionCode": "4",
                "text": "employees, weak coordination, lack of control"
              }
            ]
          },
          {
            "code": "4.4.3",
            "title": "Break-even analysis",
            "sectionCode": "4",
            "topicCode": "4.4",
            "bulletPoints": [
              {
                "id": "4.4.3-pt-1",
                "subtopicCode": "4.4.3",
                "topicCode": "4.4",
                "sectionCode": "4",
                "text": "concept of break-even"
              },
              {
                "id": "4.4.3-pt-2",
                "subtopicCode": "4.4.3",
                "topicCode": "4.4",
                "sectionCode": "4",
                "text": "complete or amend a simple break-even chart"
              },
              {
                "id": "4.4.3-pt-3",
                "subtopicCode": "4.4.3",
                "topicCode": "4.4",
                "sectionCode": "4",
                "text": "interpret a break-even chart"
              },
              {
                "id": "4.4.3-pt-4",
                "subtopicCode": "4.4.3",
                "topicCode": "4.4",
                "sectionCode": "4",
                "text": "calculate break-even output"
              },
              {
                "id": "4.4.3-pt-5",
                "subtopicCode": "4.4.3",
                "topicCode": "4.4",
                "sectionCode": "4",
                "text": "define, calculate and interpret the margin of safety"
              },
              {
                "id": "4.4.3-pt-6",
                "subtopicCode": "4.4.3",
                "topicCode": "4.4",
                "sectionCode": "4",
                "text": "use break-even analysis to help make decisions: effect of changes in price, changes in fixed"
              },
              {
                "id": "4.4.3-pt-7",
                "subtopicCode": "4.4.3",
                "topicCode": "4.4",
                "sectionCode": "4",
                "text": "costs, changes in variable cost per unit"
              },
              {
                "id": "4.4.3-pt-8",
                "subtopicCode": "4.4.3",
                "topicCode": "4.4",
                "sectionCode": "4",
                "text": "limitations of break-even analysis"
              }
            ]
          }
        ],
        "sectionCode": "4"
      },
      {
        "code": "4.5",
        "title": "Quality of goods and services",
        "subtopics": [
          {
            "code": "4.5.1",
            "title": "Why quality is important and how quality may be achieved",
            "sectionCode": "4",
            "topicCode": "4.5",
            "bulletPoints": [
              {
                "id": "4.5.1-pt-1",
                "subtopicCode": "4.5.1",
                "topicCode": "4.5",
                "sectionCode": "4",
                "text": "what quality means and why it is important for businesses"
              },
              {
                "id": "4.5.1-pt-2",
                "subtopicCode": "4.5.1",
                "topicCode": "4.5",
                "sectionCode": "4",
                "text": "concept of quality control"
              },
              {
                "id": "4.5.1-pt-3",
                "subtopicCode": "4.5.1",
                "topicCode": "4.5",
                "sectionCode": "4",
                "text": "concept of quality assurance"
              },
              {
                "id": "4.5.1-pt-4",
                "subtopicCode": "4.5.1",
                "topicCode": "4.5",
                "sectionCode": "4",
                "text": "advantages and disadvantages of quality control and quality assurance"
              },
              {
                "id": "4.5.1-pt-5",
                "subtopicCode": "4.5.1",
                "topicCode": "4.5",
                "sectionCode": "4",
                "text": "recommend and justify whether to use quality control or quality assurance in a given situation"
              }
            ]
          }
        ],
        "sectionCode": "4"
      },
      {
        "code": "4.6",
        "title": "Location decisions",
        "subtopics": [
          {
            "code": "4.6.1",
            "title": "Main factors which influence location decisions",
            "sectionCode": "4",
            "topicCode": "4.6",
            "bulletPoints": [
              {
                "id": "4.6.1-pt-1",
                "subtopicCode": "4.6.1",
                "topicCode": "4.6",
                "sectionCode": "4",
                "text": "factors which influence the location decisions of a manufacturing business"
              },
              {
                "id": "4.6.1-pt-2",
                "subtopicCode": "4.6.1",
                "topicCode": "4.6",
                "sectionCode": "4",
                "text": "factors which influence the location decisions of a service business"
              },
              {
                "id": "4.6.1-pt-3",
                "subtopicCode": "4.6.1",
                "topicCode": "4.6",
                "sectionCode": "4",
                "text": "factors that a business could consider when deciding which country to locate its operations in"
              },
              {
                "id": "4.6.1-pt-4",
                "subtopicCode": "4.6.1",
                "topicCode": "4.6",
                "sectionCode": "4",
                "text": "recommend and justify an appropriate location for a business in a given situation"
              },
              {
                "id": "4.6.1-pt-5",
                "subtopicCode": "4.6.1",
                "topicCode": "4.6",
                "sectionCode": "4",
                "text": "the use of cash flow forecasts. The main features of a statement of profit or loss are covered as well as"
              },
              {
                "id": "4.6.1-pt-6",
                "subtopicCode": "4.6.1",
                "topicCode": "4.6",
                "sectionCode": "4",
                "text": "statements of financial position. Finally, this topic includes analysis of accounts, profitability and liquidity, and"
              },
              {
                "id": "4.6.1-pt-7",
                "subtopicCode": "4.6.1",
                "topicCode": "4.6",
                "sectionCode": "4",
                "text": "different users of accounts."
              }
            ]
          }
        ],
        "sectionCode": "4"
      }
    ]
  },
  {
    "code": "5",
    "title": "5. Financial information and decisions",
    "topics": [
      {
        "code": "5.1",
        "title": "Business finance",
        "subtopics": [
          {
            "code": "5.1.1",
            "title": "The need for business finance",
            "sectionCode": "5",
            "topicCode": "5.1",
            "bulletPoints": [
              {
                "id": "5.1.1-pt-1",
                "subtopicCode": "5.1.1",
                "topicCode": "5.1",
                "sectionCode": "5",
                "text": "the main reasons why businesses need finance: start-up capital, capital for expansion/growth, replacing existing non-current assets, investing in new technology, working capital"
              },
              {
                "id": "5.1.1-pt-2",
                "subtopicCode": "5.1.1",
                "topicCode": "5.1",
                "sectionCode": "5",
                "text": "short-term and long-term finance needs of a business"
              },
              {
                "id": "5.1.1-pt-3",
                "subtopicCode": "5.1.1",
                "topicCode": "5.1",
                "sectionCode": "5",
                "text": "concept and importance of working capital"
              }
            ]
          },
          {
            "code": "5.1.2",
            "title": "The main sources of finance",
            "sectionCode": "5",
            "topicCode": "5.1",
            "bulletPoints": [
              {
                "id": "5.1.2-pt-1",
                "subtopicCode": "5.1.2",
                "topicCode": "5.1",
                "sectionCode": "5",
                "text": "internal sources of finance: owners' investment, retained profit, sale of unwanted assets, working, capital"
              },
              {
                "id": "5.1.2-pt-2",
                "subtopicCode": "5.1.2",
                "topicCode": "5.1",
                "sectionCode": "5",
                "text": "external sources of finance: share capital or issuing shares, venture capital, bank overdrafts, leasing, hire purchase, bank loans, trade credit, government grants, crowdfunding"
              },
              {
                "id": "5.1.2-pt-3",
                "subtopicCode": "5.1.2",
                "topicCode": "5.1",
                "sectionCode": "5",
                "text": "advantages and disadvantages of internal and external sources of finance"
              },
              {
                "id": "5.1.2-pt-4",
                "subtopicCode": "5.1.2",
                "topicCode": "5.1",
                "sectionCode": "5",
                "text": "the main factors to consider when selecting a source of finance: size of business, legal form of"
              },
              {
                "id": "5.1.2-pt-5",
                "subtopicCode": "5.1.2",
                "topicCode": "5.1",
                "sectionCode": "5",
                "text": "business, amount required, length of time, existing loans, cost, purpose"
              },
              {
                "id": "5.1.2-pt-6",
                "subtopicCode": "5.1.2",
                "topicCode": "5.1",
                "sectionCode": "5",
                "text": "recommend and justify an appropriate source of finance for a given situation"
              }
            ]
          }
        ],
        "sectionCode": "5"
      },
      {
        "code": "5.2",
        "title": "Cash ffow forecast",
        "subtopics": [
          {
            "code": "5.2.1",
            "title": "The importance of cash and cash flow forecasts",
            "sectionCode": "5",
            "topicCode": "5.2",
            "bulletPoints": [
              {
                "id": "5.2.1-pt-1",
                "subtopicCode": "5.2.1",
                "topicCode": "5.2",
                "sectionCode": "5",
                "text": "why cash is important to a business"
              },
              {
                "id": "5.2.1-pt-2",
                "subtopicCode": "5.2.1",
                "topicCode": "5.2",
                "sectionCode": "5",
                "text": "what a cash flow forecast is and why it is important"
              },
              {
                "id": "5.2.1-pt-3",
                "subtopicCode": "5.2.1",
                "topicCode": "5.2",
                "sectionCode": "5",
                "text": "main features of a cash flow forecast: cash inflow, cash outflow, net cash flow, opening balance, closing balance"
              },
              {
                "id": "5.2.1-pt-4",
                "subtopicCode": "5.2.1",
                "topicCode": "5.2",
                "sectionCode": "5",
                "text": "amend or complete a simple cash flow forecast"
              },
              {
                "id": "5.2.1-pt-5",
                "subtopicCode": "5.2.1",
                "topicCode": "5.2",
                "sectionCode": "5",
                "text": "interpret a simple cash flow forecast"
              },
              {
                "id": "5.2.1-pt-6",
                "subtopicCode": "5.2.1",
                "topicCode": "5.2",
                "sectionCode": "5",
                "text": "how a short-term cash flow problem may be overcome: overdraft, delaying supplier payments, asking customers to pay more quickly, delay purchase of non-current assets"
              }
            ]
          }
        ],
        "sectionCode": "5"
      },
      {
        "code": "5.3",
        "title": "Profit and loss",
        "subtopics": [
          {
            "code": "5.3.1",
            "title": "What is profit and why it is important",
            "sectionCode": "5",
            "topicCode": "5.3",
            "bulletPoints": [
              {
                "id": "5.3.1-pt-1",
                "subtopicCode": "5.3.1",
                "topicCode": "5.3",
                "sectionCode": "5",
                "text": "what profit is"
              },
              {
                "id": "5.3.1-pt-2",
                "subtopicCode": "5.3.1",
                "topicCode": "5.3",
                "sectionCode": "5",
                "text": "importance of profit to private sector businesses: reward for risk-taking, source of finance, measure of success, attract investors"
              }
            ]
          },
          {
            "code": "5.3.2",
            "title": "Statement of profit or loss",
            "sectionCode": "5",
            "topicCode": "5.3",
            "bulletPoints": [
              {
                "id": "5.3.2-pt-1",
                "subtopicCode": "5.3.2",
                "topicCode": "5.3",
                "sectionCode": "5",
                "text": "main features of a statement of profit or loss: revenue, cost of sales, gross profit, expenses, profit"
              },
              {
                "id": "5.3.2-pt-2",
                "subtopicCode": "5.3.2",
                "topicCode": "5.3",
                "sectionCode": "5",
                "text": "make simple calculations based on a statement of profit or loss: revenue, cost of sales, gross, profit, expenses, profit"
              },
              {
                "id": "5.3.2-pt-3",
                "subtopicCode": "5.3.2",
                "topicCode": "5.3",
                "sectionCode": "5",
                "text": "make decisions based on simple statements of profit or loss"
              }
            ]
          }
        ],
        "sectionCode": "5"
      },
      {
        "code": "5.4",
        "title": "Statement of financial position",
        "subtopics": [
          {
            "code": "5.4.1",
            "title": "The main elements of a statement of financial position",
            "sectionCode": "5",
            "topicCode": "5.4",
            "bulletPoints": [
              {
                "id": "5.4.1-pt-1",
                "subtopicCode": "5.4.1",
                "topicCode": "5.4",
                "sectionCode": "5",
                "text": "non-current assets, e.g. property (land and buildings, machinery"
              },
              {
                "id": "5.4.1-pt-2",
                "subtopicCode": "5.4.1",
                "topicCode": "5.4",
                "sectionCode": "5",
                "text": "current assets, e.g. inventory, trade receivables, cash"
              },
              {
                "id": "5.4.1-pt-3",
                "subtopicCode": "5.4.1",
                "topicCode": "5.4",
                "sectionCode": "5",
                "text": "non-current liabilities, e.g. bank loans"
              },
              {
                "id": "5.4.1-pt-4",
                "subtopicCode": "5.4.1",
                "topicCode": "5.4",
                "sectionCode": "5",
                "text": "current liabilities, e.g. trade payables, overdraft"
              },
              {
                "id": "5.4.1-pt-5",
                "subtopicCode": "5.4.1",
                "topicCode": "5.4",
                "sectionCode": "5",
                "text": "concept of capital employed"
              },
              {
                "id": "5.4.1-pt-6",
                "subtopicCode": "5.4.1",
                "topicCode": "5.4",
                "sectionCode": "5",
                "text": "make simple calculations based on statements of financial position: total assets, total liabilities, working capital"
              },
              {
                "id": "5.4.1-pt-7",
                "subtopicCode": "5.4.1",
                "topicCode": "5.4",
                "sectionCode": "5",
                "text": "make decisions based on simple statements of financial position"
              }
            ]
          }
        ],
        "sectionCode": "5"
      },
      {
        "code": "5.5",
        "title": "Analysis of accounts",
        "subtopics": [
          {
            "code": "5.5.1",
            "title": "Profitability",
            "sectionCode": "5",
            "topicCode": "5.5",
            "bulletPoints": [
              {
                "id": "5.5.1-pt-1",
                "subtopicCode": "5.5.1",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "concept of profitability"
              },
              {
                "id": "5.5.1-pt-2",
                "subtopicCode": "5.5.1",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "calculate and interpret the following profitability ratios"
              },
              {
                "id": "5.5.1-pt-3",
                "subtopicCode": "5.5.1",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "gross profit margin"
              },
              {
                "id": "5.5.1-pt-4",
                "subtopicCode": "5.5.1",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "profit margin"
              },
              {
                "id": "5.5.1-pt-5",
                "subtopicCode": "5.5.1",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "return on capital employed (ROCE)"
              }
            ]
          },
          {
            "code": "5.5.2",
            "title": "Liquidity",
            "sectionCode": "5",
            "topicCode": "5.5",
            "bulletPoints": [
              {
                "id": "5.5.2-pt-1",
                "subtopicCode": "5.5.2",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "concept of liquidity"
              },
              {
                "id": "5.5.2-pt-2",
                "subtopicCode": "5.5.2",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "calculate and interpret the following liquidity ratios"
              },
              {
                "id": "5.5.2-pt-3",
                "subtopicCode": "5.5.2",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "current ratio"
              },
              {
                "id": "5.5.2-pt-4",
                "subtopicCode": "5.5.2",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "acid test ratio"
              }
            ]
          },
          {
            "code": "5.5.3",
            "title": "Users of accounts",
            "sectionCode": "5",
            "topicCode": "5.5",
            "bulletPoints": [
              {
                "id": "5.5.3-pt-1",
                "subtopicCode": "5.5.3",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "users of accounts and ratio analysis: internal, e.g. owners (sole traders, partnerships, shareholders, managers, employees"
              },
              {
                "id": "5.5.3-pt-2",
                "subtopicCode": "5.5.3",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "users of accounts and ratio analysis: external, e.g. suppliers, government, lenders/banks"
              },
              {
                "id": "5.5.3-pt-3",
                "subtopicCode": "5.5.3",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "how users of accounts may use financial information to help make decisions, e.g. whether to lend"
              },
              {
                "id": "5.5.3-pt-4",
                "subtopicCode": "5.5.3",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "to or invest in a business"
              },
              {
                "id": "5.5.3-pt-5",
                "subtopicCode": "5.5.3",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "limitations of using accounts and ratio analysis"
              },
              {
                "id": "5.5.3-pt-6",
                "subtopicCode": "5.5.3",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "taxes, interest rates and exchange rates. The importance of globalisation is recognised as well as the"
              },
              {
                "id": "5.5.3-pt-7",
                "subtopicCode": "5.5.3",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "advantages and disadvantages of multinational companies (MNCs). Environmental issues and ethical issues"
              },
              {
                "id": "5.5.3-pt-8",
                "subtopicCode": "5.5.3",
                "topicCode": "5.5",
                "sectionCode": "5",
                "text": "are considered along with the role of pressure groups."
              }
            ]
          }
        ],
        "sectionCode": "5"
      }
    ]
  },
  {
    "code": "6",
    "title": "6. External influences on business activity",
    "topics": [
      {
        "code": "6.1",
        "title": "Economic issues",
        "subtopics": [
          {
            "code": "6.1.1",
            "title": "Business cycle",
            "sectionCode": "6",
            "topicCode": "6.1",
            "bulletPoints": [
              {
                "id": "6.1.1-pt-1",
                "subtopicCode": "6.1.1",
                "topicCode": "6.1",
                "sectionCode": "6",
                "text": "main stages of the business cycle: growth, boom, recession, slump"
              },
              {
                "id": "6.1.1-pt-2",
                "subtopicCode": "6.1.1",
                "topicCode": "6.1",
                "sectionCode": "6",
                "text": "how each stage of the business cycle may affect a business"
              },
              {
                "id": "6.1.1-pt-3",
                "subtopicCode": "6.1.1",
                "topicCode": "6.1",
                "sectionCode": "6",
                "text": "effects of changes in the levels of employment, inflation and economic growth on a business"
              }
            ]
          },
          {
            "code": "6.1.2",
            "title": "Effects of government policy",
            "sectionCode": "6",
            "topicCode": "6.1",
            "bulletPoints": [
              {
                "id": "6.1.2-pt-1",
                "subtopicCode": "6.1.2",
                "topicCode": "6.1",
                "sectionCode": "6",
                "text": "effects of changes in taxes on business profit"
              },
              {
                "id": "6.1.2-pt-2",
                "subtopicCode": "6.1.2",
                "topicCode": "6.1",
                "sectionCode": "6",
                "text": "effects of changes in taxes on people's income"
              },
              {
                "id": "6.1.2-pt-3",
                "subtopicCode": "6.1.2",
                "topicCode": "6.1",
                "sectionCode": "6",
                "text": "effects of changes in government spending"
              },
              {
                "id": "6.1.2-pt-4",
                "subtopicCode": "6.1.2",
                "topicCode": "6.1",
                "sectionCode": "6",
                "text": "effects of changes in interest rates"
              },
              {
                "id": "6.1.2-pt-5",
                "subtopicCode": "6.1.2",
                "topicCode": "6.1",
                "sectionCode": "6",
                "text": "how businesses may respond to changes in taxes and interest rates"
              }
            ]
          }
        ],
        "sectionCode": "6"
      },
      {
        "code": "6.2",
        "title": "Business and the international economy",
        "subtopics": [
          {
            "code": "6.2.1",
            "title": "The importance of globalisation",
            "sectionCode": "6",
            "topicCode": "6.2",
            "bulletPoints": [
              {
                "id": "6.2.1-pt-1",
                "subtopicCode": "6.2.1",
                "topicCode": "6.2",
                "sectionCode": "6",
                "text": "reasons for globalisation: improved transport links, technological change including communication, free trade agreements, newly industrialised countries"
              },
              {
                "id": "6.2.1-pt-2",
                "subtopicCode": "6.2.1",
                "topicCode": "6.2",
                "sectionCode": "6",
                "text": "opportunities and threats of globalisation for businesses"
              },
              {
                "id": "6.2.1-pt-3",
                "subtopicCode": "6.2.1",
                "topicCode": "6.2",
                "sectionCode": "6",
                "text": "import tariffs and import quotas"
              },
              {
                "id": "6.2.1-pt-4",
                "subtopicCode": "6.2.1",
                "topicCode": "6.2",
                "sectionCode": "6",
                "text": "effects of import tariffs and import quotas on businesses"
              }
            ]
          },
          {
            "code": "6.2.2",
            "title": "Multinational companies (MNCs)",
            "sectionCode": "6",
            "topicCode": "6.2",
            "bulletPoints": [
              {
                "id": "6.2.2-pt-1",
                "subtopicCode": "6.2.2",
                "topicCode": "6.2",
                "sectionCode": "6",
                "text": "advantages to a business of becoming an MNC"
              },
              {
                "id": "6.2.2-pt-2",
                "subtopicCode": "6.2.2",
                "topicCode": "6.2",
                "sectionCode": "6",
                "text": "advantages for the country where an MNC is located, e.g. jobs, exports, increased choice, investment"
              },
              {
                "id": "6.2.2-pt-3",
                "subtopicCode": "6.2.2",
                "topicCode": "6.2",
                "sectionCode": "6",
                "text": "disadvantages for the country where an MNC is located, e.g. increased competition, environmental damage, exploitation of natural resources, repatriation of profits"
              }
            ]
          },
          {
            "code": "6.2.3",
            "title": "External costs and benefits",
            "sectionCode": "6",
            "topicCode": "6.2",
            "bulletPoints": [
              {
                "id": "6.2.3-pt-1",
                "subtopicCode": "6.2.3",
                "topicCode": "6.2",
                "sectionCode": "6",
                "text": "external costs and external benefits of business decisions"
              }
            ]
          },
          {
            "code": "6.2.4",
            "title": "Exchange rates",
            "sectionCode": "6",
            "topicCode": "6.2",
            "bulletPoints": [
              {
                "id": "6.2.4-pt-1",
                "subtopicCode": "6.2.4",
                "topicCode": "6.2",
                "sectionCode": "6",
                "text": "appreciation and depreciation of an exchange rate"
              },
              {
                "id": "6.2.4-pt-2",
                "subtopicCode": "6.2.4",
                "topicCode": "6.2",
                "sectionCode": "6",
                "text": "how changes in exchange rates can affect businesses which import and export products and"
              },
              {
                "id": "6.2.4-pt-3",
                "subtopicCode": "6.2.4",
                "topicCode": "6.2",
                "sectionCode": "6",
                "text": "services, e.g. price, costs, competitiveness"
              }
            ]
          }
        ],
        "sectionCode": "6"
      },
      {
        "code": "6.3",
        "title": "Business and the environment",
        "subtopics": [
          {
            "code": "6.3.1",
            "title": "Environmental issues",
            "sectionCode": "6",
            "topicCode": "6.3",
            "bulletPoints": [
              {
                "id": "6.3.1-pt-1",
                "subtopicCode": "6.3.1",
                "topicCode": "6.3",
                "sectionCode": "6",
                "text": "how business activity can negatively affect the environment, e.g. pollution, depletion of resources"
              },
              {
                "id": "6.3.1-pt-2",
                "subtopicCode": "6.3.1",
                "topicCode": "6.3",
                "sectionCode": "6",
                "text": "why businesses may respond to environmental issues, e.g. improved reputation, increased sales"
              },
              {
                "id": "6.3.1-pt-3",
                "subtopicCode": "6.3.1",
                "topicCode": "6.3",
                "sectionCode": "6",
                "text": "how businesses may respond to environmental issues"
              },
              {
                "id": "6.3.1-pt-4",
                "subtopicCode": "6.3.1",
                "topicCode": "6.3",
                "sectionCode": "6",
                "text": "effects of legal controls over business activity affecting the environment: how, what and where to"
              },
              {
                "id": "6.3.1-pt-5",
                "subtopicCode": "6.3.1",
                "topicCode": "6.3",
                "sectionCode": "6",
                "text": "produce or sell, influence on costs"
              }
            ]
          }
        ],
        "sectionCode": "6"
      },
      {
        "code": "6.4",
        "title": "Business and ethical issues",
        "subtopics": [
          {
            "code": "6.4.1",
            "title": "Ethical issues",
            "sectionCode": "6",
            "topicCode": "6.4",
            "bulletPoints": [
              {
                "id": "6.4.1-pt-1",
                "subtopicCode": "6.4.1",
                "topicCode": "6.4",
                "sectionCode": "6",
                "text": "ethical issues which may affect businesses, e.g. child labour, paying fair wages to employees, paying fair prices to suppliers, using suppliers who do not damage the environment"
              },
              {
                "id": "6.4.1-pt-2",
                "subtopicCode": "6.4.1",
                "topicCode": "6.4",
                "sectionCode": "6",
                "text": "how businesses may respond to ethical issues"
              },
              {
                "id": "6.4.1-pt-3",
                "subtopicCode": "6.4.1",
                "topicCode": "6.4",
                "sectionCode": "6",
                "text": "advantages and disadvantages of a business being ethical"
              }
            ]
          }
        ],
        "sectionCode": "6"
      },
      {
        "code": "6.5",
        "title": "Pressure groups",
        "subtopics": [
          {
            "code": "6.5.1",
            "title": "The role of pressure groups",
            "sectionCode": "6",
            "topicCode": "6.5",
            "bulletPoints": [
              {
                "id": "6.5.1-pt-1",
                "subtopicCode": "6.5.1",
                "topicCode": "6.5",
                "sectionCode": "6",
                "text": "how pressure groups can influence business decisions"
              }
            ]
          }
        ],
        "sectionCode": "6"
      }
    ]
  }
];
