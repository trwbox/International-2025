class PagesController < ApplicationController
  def thankyou
    @order_id = params[:guid]
    @amount = params[:price]
    @name = params[:product_name]
  end
end
