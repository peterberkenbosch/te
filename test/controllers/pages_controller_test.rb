require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "should get home" do
    get root_url
    assert_response :success
  end

  test "homepage contains brand name" do
    get root_url
    assert_select "h1", /Tesouros da/
  end

  test "homepage contains navigation" do
    get root_url
    assert_select "nav.nav"
  end

  test "homepage contains footer" do
    get root_url
    assert_select "footer.footer"
  end

  test "homepage has pt-BR lang attribute" do
    get root_url
    assert_select "html[lang='pt-BR']"
  end
end
