require 'test_helper'

class PremisesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @premise = premises(:one)
  end

  test "should get index" do
    get premises_url
    assert_response :success
  end

  test "should get new" do
    get new_premise_url
    assert_response :success
  end

  test "should create premise" do
    assert_difference('Premise.count') do
      post premises_url, params: { premise: { name: @premise.name } }
    end

    assert_redirected_to premise_url(Premise.last)
  end

  test "should show premise" do
    get premise_url(@premise)
    assert_response :success
  end

  test "should get edit" do
    get edit_premise_url(@premise)
    assert_response :success
  end

  test "should update premise" do
    patch premise_url(@premise), params: { premise: { name: @premise.name } }
    assert_redirected_to premise_url(@premise)
  end

  test "should destroy premise" do
    assert_difference('Premise.count', -1) do
      delete premise_url(@premise)
    end

    assert_redirected_to premises_url
  end
end
