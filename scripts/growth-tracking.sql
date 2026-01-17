-- SQL View to track Viral K-Factor for Growth Analysis
-- Formula: K = (number of invites sent) * (conversion rate)

CREATE OR REPLACE VIEW growth_metrics AS
SELECT 
    u.id AS user_id,
    u.email,
    COUNT(r.id) AS total_referrals_sent,
    COUNT(CASE WHEN r.status = 'converted' THEN 1 END) AS successful_conversions,
    ROUND(
        (COUNT(CASE WHEN r.status = 'converted' THEN 1 END)::numeric / 
        NULLIF(COUNT(r.id), 0)), 2
    ) AS conversion_rate
FROM users u
LEFT JOIN referrals r ON u.id = r.referrer_id
GROUP BY u.id;

-- Function to award credits automatically upon successful 'Great Migration' upload
CREATE OR REPLACE FUNCTION award_referral_bonus()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'converted' THEN
        -- Award 5000 MB to referrer
        UPDATE user_quotas 
        SET ai_processing_limit = ai_processing_limit + 5000 
        WHERE user_id = NEW.referrer_id;
        
        -- Award 5000 MB to referee
        UPDATE user_quotas 
        SET ai_processing_limit = ai_processing_limit + 5000 
        WHERE user_id = NEW.referee_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;