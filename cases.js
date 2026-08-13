export const cases = [
  {
    "id": "d1_school_closure",
    "day": 1,
    "tutorial_step": "profile_search",
    "tutorial_retry": true,
    "mentor_reacts": true,
    "title": {
      "zh-CN": "明天全市停课？",
      "en": "Citywide closure tomorrow?"
    },
    "brief": {
      "zh-CN": "先看看谁发的，再查查正文里的说法。",
      "en": "Check who posted it, then look up the claim."
    },
    "post": {
      "account_id": "city_fresh",
      "time": "18:40",
      "body": {
        "zh-CN": "【紧急】市教育局通知：明天全市停课。所有学校都要执行，请立即转发给家长！",
        "en": "[URGENT] The education bureau says every school will close tomorrow. Share this with parents now!"
      },
      "keywords": [
        {
          "text": {
            "zh-CN": "全市停课",
            "en": "every school will close tomorrow"
          },
          "result_set_id": "school_closure"
        }
      ],
      "media_id": "",
      "metrics": {
        "shares": 12804,
        "comments": 356
      }
    },
    "rule_ids": [
      "source",
      "related_information"
    ],
    "accepted_decisions": [
      "lock"
    ],
    "feedback": {
      "pass": {
        "zh-CN": "不对吧？你仔细看了没，刚才检索说只有两所学校停课。倒是有个全市停课的——但是那是去年的。等你自己独立审核的时候仔细点，就没有我帮你校对了。",
        "en": "Hang on. Did you read those results carefully? Only two schools are closing. There was a citywide closure, sure—but that was last year. Be more careful when you're on your own. I won't always be here to check your work."
      },
      "lock": {
        "zh-CN": "嗯，对。通知里只有两所学校停课，另一个“全市停课”还是去年的旧闻。看到这种催着人转发的帖子，先别被它带着跑。",
        "en": "Yeah, that's it. The notice names only two schools, and that other citywide closure is old news from last year. When a post pushes you to share right away, don't let it set your pace."
      }
    }
  },
  {
    "id": "d1_reservoir",
    "day": 1,
    "tutorial_step": "media",
    "tutorial_retry": true,
    "mentor_reacts": true,
    "title": {
      "zh-CN": "水库已经见底？",
      "en": "Has the reservoir run dry?"
    },
    "brief": {
      "zh-CN": "这条帖子带了一张照片。",
      "en": "This post includes a photo."
    },
    "post": {
      "account_id": "harbor_eye",
      "time": "19:12",
      "body": {
        "zh-CN": "北山水库已经见底，今年肯定要限水了。照片就是今天拍的。",
        "en": "Beishan Reservoir has run dry. Water rationing is certain. This photo was taken today."
      },
      "keywords": [
        {
          "text": {
            "zh-CN": "北山水库已经见底",
            "en": "Beishan Reservoir has run dry"
          },
          "result_set_id": "reservoir_photo"
        }
      ],
      "media_id": "reservoir_2022",
      "metrics": {
        "shares": 2301,
        "comments": 94
      }
    },
    "rule_ids": [
      "source",
      "related_information"
    ],
    "accepted_decisions": [
      "lock"
    ],
    "feedback": {
      "pass": {
        "zh-CN": "等等，你再看一眼检测器。照片是2022年检修时拍的，帖子却说是今天。旧照片这样拿出来用，很容易把人吓住。",
        "en": "Wait—look at the inspector again. The photo was taken during maintenance in 2022, but the post says it was taken today. Reusing an old image like this can scare people fast."
      },
      "lock": {
        "zh-CN": "嗯。不错，很仔细。检测器上发现它是好久之前拍的了，但是这个帖子却说是今天拍的。明显是想引起慌乱。",
        "en": "Mm. Good—you were paying attention. The inspector shows the photo was taken years ago, but the post calls it today's picture. That's clearly meant to stir up panic."
      }
    }
  },
  {
    "id": "d1_qingwan_all_schools_closed",
    "day": 1,
    "title": {
      "zh-CN": "明天都不用上课？",
      "en": "No School Tomorrow?"
    },
    "brief": {
      "zh-CN": "这条帖子包含一项需要核验的说法。",
      "en": "This post contains a claim to check."
    },
    "post": {
      "account_id": "qingwan_daily",
      "time": "18:47",
      "body": {
        "zh-CN": "刚收到消息，青湾区因为积水，明天全区中小学明天停课。家里有学生的记得提前安排，看到的互相转一下。",
        "en": "Just heard that because of flooding, all schools in Qingwan are closed tomorrow. If you have kids in school, make plans early and pass this around."
      },
      "keywords": [
        {
          "text": {
            "zh-CN": "全区中小学明天停课",
            "en": "all schools in Qingwan are closed tomorrow"
          },
          "result_set_id": "qingwan_school_closure_check"
        }
      ],
      "media_id": "",
      "metrics": {
        "shares": 1842,
        "comments": 137
      }
    },
    "rule_ids": [
      "source",
      "related_information"
    ],
    "accepted_decisions": [
      "lock"
    ]
  }
];
export const accounts = [
  {
    "id": "city_fresh",
    "handle": "@城市新鲜事",
    "handle_en": "@city_fresh_news",
    "display_name": {
      "zh-CN": "城市新鲜事",
      "en": "City Fresh News"
    },
    "account_type": {
      "zh-CN": "个人自媒体",
      "en": "Personal media account"
    },
    "verification": {
      "zh-CN": "无机构认证",
      "en": "No institutional verification"
    },
    "bio": {
      "zh-CN": "本地消息、生活见闻",
      "en": "Local updates and daily life"
    },
    "registered": "2025-11-03"
  },
  {
    "id": "harbor_eye",
    "handle": "@海城随手拍",
    "handle_en": "@harbor_snapshots",
    "display_name": {
      "zh-CN": "海城随手拍",
      "en": "Harbor Snapshots"
    },
    "account_type": {
      "zh-CN": "个人账号",
      "en": "Personal account"
    },
    "verification": {
      "zh-CN": "未认证",
      "en": "Unverified"
    },
    "bio": {
      "zh-CN": "记录身边事",
      "en": "Things I see around town"
    },
    "registered": "2024-04-19"
  },
  {
    "id": "qingwan_daily",
    "handle": "@青湾每日速报",
    "handle_en": "@qingwan_daily",
    "display_name": {
      "zh-CN": "青湾每日速报",
      "en": "Qingwan Daily Updates"
    },
    "account_type": {
      "zh-CN": "个人自媒体",
      "en": "Independent media account"
    },
    "verification": {
      "zh-CN": "无机构认证",
      "en": "No institutional verification"
    },
    "bio": {
      "zh-CN": "青湾本地消息、交通、学校动态",
      "en": "Local updates on Qingwan, transport and schools"
    },
    "registered": "2026-01-14"
  }
];