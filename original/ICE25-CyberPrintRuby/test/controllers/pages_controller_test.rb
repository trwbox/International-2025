require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "should get thankyou" do
    get pages_thankyou_url
    assert_response :success
  end
end
